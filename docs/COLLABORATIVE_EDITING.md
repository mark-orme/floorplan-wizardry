
# Collaborative Canvas Editing

This document explains how the real-time collaborative canvas editing is implemented in our application.

## Architecture

The collaborative editing system uses a WebSocket-based approach with Pusher to synchronize canvas states between multiple users. The implementation follows these key principles:

1. **Event-based synchronization**: Canvas changes trigger events that are broadcast to all connected clients
2. **State-based updates**: Complete canvas state is sent rather than individual operations (CRDT-like approach)
3. **Presence awareness**: Connected users can see who else is editing the canvas
4. **Throttled updates**: Canvas changes are batched and throttled to prevent overwhelming the network

## Key Components

### 1. `useRealtimeCanvasSync` Hook

This is the core hook that manages synchronization between multiple clients. It:

- Establishes a connection to a channel specific to the current canvas
- Listens for updates from other users
- Broadcasts local changes to all other connected users
- Tracks collaborator presence and activity

### 2. Canvas State Capture Utilities

The `canvasStateCapture.ts` utilities handle serialization and deserialization of canvas state:

- `captureCanvasState`: Serializes the current canvas state, filtering out grid objects
- `applyCanvasState`: Applies a serialized state to the canvas while preserving grid objects

### 3. Enhanced Canvas Components

Both `DrawingManager` and `CanvasWithPersistence` components have been updated to:

- Connect to the WebSocket channel
- Track collaborators
- Display a collaborator count indicator
- Synchronize canvas changes in real-time

## Usage

To enable collaborative editing, set the `enableCollaboration` prop to `true` on the canvas components:

```jsx
<CanvasWithPersistence
  width={800}
  height={600}
  enableCollaboration={true}
  userName="UserName"
/>
```

Or with the DrawingManager:

```jsx
<DrawingManager
  fabricCanvas={canvas}
  enableCollaboration={true}
  userName="UserName"
  onCollaboratorUpdate={(count) => console.log(`${count} collaborators`)}
/>
```

## Implementation Details

### Channel Naming

Channels are named based on the current URL path to ensure users editing the same canvas are in the same channel:

```javascript
const channelName = `canvas-collab-${window.location.pathname.replace(/\//g, '-') || 'default'}`;
```

### Event Types

Two primary event types are used:

1. `canvas-update`: Sent when canvas content changes
2. `presence-update`: Sent periodically to indicate user presence

### Collaborator Tracking

Collaborators are tracked with the following information:

- `id`: Unique identifier
- `name`: Display name
- `color`: Assigned color for UI representation
- `lastActive`: Timestamp of last activity
- `isActive`: Whether the user is currently active (based on recent activity)
- `lastSeen`: Date object representing last seen time

### Performance Considerations

- Canvas updates are throttled (default: 500ms) to prevent excessive network traffic
- Only non-grid objects are synchronized to reduce payload size
- Presence updates are sent periodically (every 30 seconds) to maintain awareness
- Inactive collaborators are automatically marked as inactive after 60 seconds

## Future Improvements

Potential enhancements to the collaborative editing system:

1. Operation-based synchronization for more fine-grained updates
2. Conflict resolution strategies for simultaneous edits
3. Enhanced presence features (cursor position sharing, editing indicators)
4. Locking mechanism for objects being edited
5. History tracking with user attribution

## Troubleshooting

Common issues and their solutions:

- **Updates not syncing**: Check connection status and channel subscription
- **Duplicate updates**: Ensure `isUpdateFromThisDevice` is working correctly
- **Grid disappearing**: Verify grid objects are being preserved in `applyCanvasState`
- **Performance issues**: Increase throttle time or optimize serialization/deserialization
