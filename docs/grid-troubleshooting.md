
# Grid Troubleshooting Guide

This document provides guidance for diagnosing and resolving common grid-related issues in the FloorPlan Designer.

## Common Grid Issues

### Grid Not Visible

**Symptoms:**
- Grid lines are missing
- Canvas appears blank without reference lines
- Measurements don't align with expected grid

**Diagnostic Steps:**
1. Open the browser console (F12)
2. Check for grid-related errors
3. Use the GridDebugOverlay to view grid status

**Solutions:**
1. **Manual Fix**: Click "Force Visible" in the GridDebugOverlay
2. **Complete Recreation**: Click "Recreate Grid" in the GridDebugOverlay
3. **Emergency Fix**: Run `window.fixGrid()` in the browser console

### Grid Partially Visible

**Symptoms:**
- Some grid lines are visible, others are missing
- Grid appears incomplete or uneven

**Diagnostic Steps:**
1. Use "Analyze Grid" in the GridDebugOverlay
2. Check the count of visible vs. invisible grid objects

**Solutions:**
1. Use "Force Visible" in the GridDebugOverlay
2. If that fails, use "Recreate Grid" for a complete reset

### Grid Objects Not Aligning

**Symptoms:**
- Objects don't snap properly to grid
- Measurements seem off by small amounts

**Diagnostic Steps:**
1. Verify GRID_CONSTANTS settings in the codebase
2. Check that both small and large grid lines are visible
3. Verify the grid scale is correct

**Solutions:**
1. Reset zoom to 100%
2. Recreate grid with proper scale
3. Verify PIXELS_PER_METER constant is set correctly

## Using the GridDebugOverlay

The GridDebugOverlay provides several tools for grid diagnosis and repair:

### Diagnostic Tools

- **Dump State**: Outputs detailed grid information to the console
- **Analyze Grid**: Performs deep analysis of grid object health
- **Refresh Info**: Updates the grid status display

### Repair Tools

- **Force Visible**: Makes all existing grid objects visible
- **Recreate Grid**: Removes existing grid and creates a new one
- **Auto-Fix**: Toggles automatic grid repair functionality

## Emergency Recovery

In critical situations where the grid is completely broken:

1. Open the browser console (F12)
2. Run the emergency repair command:
   ```javascript
   window.fixGrid()
   ```
3. Check the result message in the console
4. If successful, the grid should immediately appear
5. If unsuccessful, try running it again or refresh the page

## Preventing Grid Issues

To avoid grid problems in future development:

1. **Use proper APIs**:
   - Always use `setGridVisibility()` to change grid visibility
   - Never directly modify grid object properties

2. **Handle errors**:
   - Add try/catch blocks around grid operations
   - Log meaningful error messages

3. **Add safeguards**:
   - Check grid existence before operations
   - Implement automatic visibility checks
   - Add recovery mechanisms for critical features

4. **Follow grid guidelines**:
   - Keep grid at the proper z-index
   - Make grid objects non-selectable
   - Set appropriate object types for grid elements

## Diagnosing Grid States

For advanced debugging, use the `diagnoseGridState()` function:

```javascript
// In browser console:
const diagnosis = window.diagnoseGrid();
console.table(diagnosis);
```

This will return detailed information about:
- Grid object counts
- Visibility status
- Canvas dimensions
- Warning and fix counts
- Grid object samples

## Reporting Grid Issues

When reporting grid issues, include:

1. Steps to reproduce the problem
2. Console errors and warnings
3. Output from diagnoseGridState()
4. Screenshot of the GridDebugOverlay
5. Information about drawing tools used
