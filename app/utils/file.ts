export function downloadBase64Image(
  base64Image: string,
  filename: string
): void {
  // This part would depend on how your base64 string looks like.
  // Usually they start with "data:image/jpeg;base64,", "data:image/png;base64," etc.
  const base64ImageContent = base64Image.replace(
    /^data:image\/[a-z]+;base64,/,
    ""
  );

  // Convert base64 to raw binary data held in a string
  let byteCharacters = atob(base64ImageContent);

  // Create an ArrayBuffer
  let arrayBuffer = new ArrayBuffer(byteCharacters.length);

  // Create a new Uint8Array
  let byteNumbers = new Uint8Array(arrayBuffer);

  // Assign the decoded characters to the Uint8Array
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // Create a blob object
  let blob = new Blob([byteNumbers], {
    type: "image/png", // Adjust the mime type accordingly
  });

  // Create a link element
  const link = document.createElement("a");

  // Set the download attribute
  link.download = filename;

  // Create a URL for the blob object
  link.href = URL.createObjectURL(blob);

  // Append the link to the body
  document.body.appendChild(link);

  // Simulate click
  link.click();

  // Remove the link after download
  setTimeout(function () {
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, 100);
}
