// Find the error in the file and update it to use only standard Error parameters
// Replace:
//   new Error("Canvas initialization failed", { 
//     context: { component: "canvas-initializer" } 
//   });
// With:
//   new Error("Canvas initialization failed");

// If you need to track the context, you can use a custom error or sentry tags separately
