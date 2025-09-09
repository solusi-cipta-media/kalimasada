export default function readFileUpload(src: string) {
  return `/api/uploads?path=${src}`;
}
