export let openapiDocument: any = null;

export function setOpenApiDocument(doc: any) {
  openapiDocument = doc;
}

export function getOpenApiDocument() {
  return openapiDocument;
}
