import { notFound } from "next/navigation";
import { ComponentDocView } from "@/components/docs/component-doc";
import { componentRegistry, getComponentBySlug } from "@/lib/registry";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return componentRegistry.map((component) => ({ slug: component.slug }));
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getComponentBySlug(slug);

  if (!doc) {
    notFound();
  }

  return <ComponentDocView doc={doc} />;
}
