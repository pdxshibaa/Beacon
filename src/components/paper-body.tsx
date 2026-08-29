export function PaperBody({ html }: { html: string }) {
  return (
    <div
      className="paper-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
