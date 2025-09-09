import fs from "fs";
import path from "path";

import { validateImageType } from "./serverHelpers";

export default async function handleUploadImage({
  file,
  oldImage,
  directory
}: {
  file: File;
  oldImage?: string | null;
  directory: string;
}) {
  // Validate MIME TYPE
  await validateImageType(file.type);

  const extension = file.name.split(".").reverse()[0];
  const fileName = Date.now().toString() + "." + extension;
  const buffer = Buffer.from(await file.arrayBuffer());
  const workspaceDir = process.cwd();
  const directoryPath = path.join(workspaceDir, "uploads", directory);
  const filePath = path.join(directoryPath, fileName);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Convert buffer to Uint8Array and save to dir
  const uint8Array = new Uint8Array(buffer);

  fs.writeFileSync(filePath, uint8Array);

  // Delete old image
  if (oldImage) {
    const oldImagePath = path.join(workspaceDir, "uploads", oldImage);

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  return `${directory}/${fileName}`;
}
