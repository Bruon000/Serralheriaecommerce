import { BUILDER_API_KEY, getPageSectionContent, getSiteSettings } from "../../lib/builder";
import BuilderContentBlock from "../../components/BuilderContentBlock";
import OrcamentoBody from "./OrcamentoBody";

export default async function OrcamentoPage() {
  const [sectionTop, sectionBottom, siteSettings] = BUILDER_API_KEY
    ? await Promise.all([
        getPageSectionContent("/orcamento", "top"),
        getPageSectionContent("/orcamento", "bottom"),
        getSiteSettings(),
      ])
    : [null, null, null];
  const data = { urlPath: "/orcamento", ...siteSettings };

  return (
    <div className="min-h-screen bg-background">
      {sectionTop && BUILDER_API_KEY && (
        <div className="pt-24 pb-2">
          <div className="container">
            <BuilderContentBlock content={sectionTop} model="page-section" apiKey={BUILDER_API_KEY} data={data} />
          </div>
        </div>
      )}
      <OrcamentoBody />
      {sectionBottom && BUILDER_API_KEY && (
        <div className="pb-16">
          <div className="container">
            <BuilderContentBlock content={sectionBottom} model="page-section" apiKey={BUILDER_API_KEY} data={data} />
          </div>
        </div>
      )}
    </div>
  );
}


