import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { Hero } from "@/components/ui/hero-1";
import { HeroSection } from "@/components/blocks/hero-section-1";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <HeroSection />
    </DefaultLayout>
  );
}
