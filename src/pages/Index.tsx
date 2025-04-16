
import React, { useState, useEffect } from "react";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { EditorHeader } from "@/components/canvas/EditorHeader";
import { EditorContent } from "@/components/canvas/EditorContent";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useGridManagement } from "@/hooks/useGridManagement";
import { useToolbarActions } from "@/hooks/useToolbarActions";
import { DrawingMode } from "@/constants/drawingModes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWindowSize } from "@/hooks/useWindowSize";
import { captureMessage, captureError } from "@/utils/sentryUtils";
import logger from "@/utils/logger";
import { trackComponentLoad, markPerformance, reportHealthMetrics } from "@/utils/healthMonitoring";

/**
 * Main Index page component
 * Provides the layout and navigation for the floor plan editor
 * @returns {JSX.Element} Rendered component
 */
const Index = () => {
  // Track page load in health monitoring
  useEffect(() => {
    trackComponentLoad('IndexPage');
    markPerformance('index-page-mounted');
    
    // Log loading start
    logger.info('Index page mounted - resetting initialization state');
    
    // Report page load to Sentry
    captureMessage('Index page loaded', 'page-load', {
      level: 'info',
      tags: {
        component: 'IndexPage',
        operation: 'mount'
      },
      extra: {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer || 'direct'
      }
    });
    
    // Report health metrics after 5 seconds to capture initial state
    const healthTimer = setTimeout(() => {
      reportHealthMetrics();
    }, 5000);
    
    return () => {
      logger.info('Index page unmounting - cleanup');
      clearTimeout(healthTimer);
      
      // Mark page exit performance
      markPerformance('index-page-unmounted');
    };
  }, []);
  
  // Use our custom hooks for state management
  const {
    canvas,
    setCanvas,
    showGridDebug,
    setShowGridDebug,
    forceRefreshKey,
    setForceRefreshKey,
    activeTool,
    setActiveTool,
    lineThickness,
    setLineThickness,
    lineColor,
    setLineColor,
    gridInitializedRef,
    retryCountRef,
    maxRetries,
    canvasStableRef,
    mountedRef
  } = useCanvasState();
  
  // Get user information
  const { user, login } = useAuth();
  
  // Real-time collaboration state
  const [enableSync, setEnableSync] = useState(true);
  
  // Get window size for responsive behavior
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 640; // sm breakpoint
  const isTablet = windowWidth >= 640 && windowWidth < 1024; // md-lg breakpoint
  
  // Use grid management hook
  const { toggleGridDebug, handleForceRefresh } = useGridManagement(
    canvas,
    canvasStableRef,
    gridInitializedRef,
    retryCountRef,
    mountedRef,
    maxRetries
  );
  
  // Use toolbar actions hook
  const {
    handleToolChange,
    handleUndo,
    handleRedo,
    handleClear,
    handleSave,
    handleDelete
  } = useToolbarActions(canvas);
  
  // Login as test user for demo
  const handleLoginAsTestUser = () => {
    try {
      login('photographer@example.com', 'password123')
        .then(() => {
          toast.success('Logged in as test user');
          captureMessage('Test user login successful', 'auth-success', {
            level: 'info',
            tags: {
              component: 'IndexPage',
              operation: 'login'
            }
          });
        })
        .catch(error => {
          toast.error('Login failed: ' + (error.message || 'Unknown error'));
          captureError(error, 'test-login-failed', {
            level: 'error',
            tags: {
              component: 'IndexPage',
              operation: 'login'
            }
          });
        });
    } catch (error) {
      captureError(error, 'login-execution-error', {
        level: 'error',
        tags: {
          component: 'IndexPage',
          operation: 'login'
        }
      });
      toast.error('An error occurred during login');
    }
  };
  
  // Handler functions that combine state updates with actions
  const onToolChange = (tool: DrawingMode) => {
    try {
      logger.info(`Active tool changing to: ${tool}`);
      console.log(`Changing tool to: ${tool}`);
      setActiveTool(tool);
      return tool;
    } catch (error) {
      captureError(error, 'tool-change-error', {
        level: 'error',
        tags: {
          component: 'IndexPage',
          operation: 'toolChange'
        },
        extra: {
          previousTool: activeTool,
          attemptedTool: tool
        }
      });
      return activeTool; // Return existing tool on error
    }
  };
  
  const onToggleGridDebug = () => {
    try {
      toggleGridDebug(showGridDebug);
      setShowGridDebug(prev => !prev);
    } catch (error) {
      captureError(error, 'grid-debug-toggle-error', {
        level: 'error',
        tags: {
          component: 'IndexPage',
          operation: 'toggleGridDebug'
        }
      });
    }
  };
  
  const onForceRefresh = () => {
    try {
      handleForceRefresh(canvas, setForceRefreshKey);
    } catch (error) {
      captureError(error, 'force-refresh-error', {
        level: 'error',
        tags: {
          component: 'IndexPage',
          operation: 'forceRefresh'
        }
      });
    }
  };
  
  // Update interface based on screen size
  useEffect(() => {
    if (isMobile) {
      // Adjust for mobile: larger line thickness for touch
      if (lineThickness < 3) {
        setLineThickness(3);
      }
    }
  }, [isMobile, lineThickness, setLineThickness]);
  
  // Handle collaboration toggle
  const handleCollaborationToggle = (enabled: boolean) => {
    try {
      setEnableSync(enabled);
      toast.info(enabled ? 'Real-time collaboration enabled' : 'Real-time collaboration disabled');
      captureMessage(`Collaboration ${enabled ? 'enabled' : 'disabled'}`, 'collaboration-toggle', {
        level: 'info',
        tags: {
          component: 'IndexPage',
          operation: 'toggleCollaboration',
          status: enabled ? 'enabled' : 'disabled'
        }
      });
    } catch (error) {
      captureError(error, 'collaboration-toggle-error', {
        level: 'error',
        tags: {
          component: 'IndexPage',
          operation: 'toggleCollaboration'
        }
      });
    }
  };
  
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <EditorHeader
        showGridDebug={showGridDebug}
        toggleGridDebug={onToggleGridDebug}
        handleForceRefresh={onForceRefresh}
        activeTool={activeTool}
        lineThickness={lineThickness}
        lineColor={lineColor}
        onToolChange={onToolChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
        onDelete={handleDelete}
        onLineThicknessChange={setLineThickness}
        onLineColorChange={setLineColor}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      
      <div className={`bg-muted/30 border-b px-4 py-2 flex ${isMobile ? 'flex-col space-y-2' : 'items-center justify-between'}`}>
        <div className="flex items-center space-x-2">
          {user ? (
            <div className="text-sm text-muted-foreground">
              Editing as: <span className="font-medium text-foreground">{user.name || user.email}</span>
            </div>
          ) : (
            <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleLoginAsTestUser}>
              Login as Test User
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="collaboration-mode"
            checked={enableSync}
            onCheckedChange={handleCollaborationToggle}
          />
          <Label htmlFor="collaboration-mode" className={isMobile ? "text-sm" : ""}>
            Real-time Collaboration
          </Label>
        </div>
      </div>
      
      <DrawingProvider>
        <CanvasProvider>
          <CanvasControllerProvider>
            <EditorContent
              forceRefreshKey={forceRefreshKey}
              setCanvas={setCanvas}
              showGridDebug={showGridDebug}
              tool={activeTool}
              lineThickness={lineThickness}
              lineColor={lineColor}
              enableSync={enableSync}
            />
          </CanvasControllerProvider>
        </CanvasProvider>
      </DrawingProvider>
    </main>
  );
};

export default Index;
