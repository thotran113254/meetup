/**
 * JsonLdScript - Renders JSON-LD structured data as a script tag.
 * Accepts one or more schema objects; renders each as a separate script.
 */

type JsonLdData = Record<string, unknown>;

interface JsonLdScriptProps {
  data: JsonLdData | JsonLdData[];
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
