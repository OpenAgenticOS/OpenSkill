import { useState, useMemo } from "react";
import { useLocale } from "./hooks/useLocale";
import { useSkills } from "./hooks/useSkills";
import { buildCategoryTree } from "./lib/categories";
import { t } from "./lib/i18n";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SkillGrid from "./components/SkillGrid";
import SkillDetail from "./components/SkillDetail";
import type { Skill } from "./types";

export default function App() {
  const { locale, setLocale } = useLocale();
  const { skills, loading } = useSkills(locale);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<Skill | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tree = useMemo(() => buildCategoryTree(skills, locale), [skills, locale]);

  const filtered = useMemo(() => {
    let list = skills;
    if (category) {
      list = list.filter((s) => s.category.startsWith(category));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          s.persona.toLowerCase().includes(q) ||
          s.objective.toLowerCase().includes(q),
      );
    }
    return list;
  }, [skills, category, search]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        locale={locale}
        onLocaleChange={setLocale}
        search={search}
        onSearchChange={setSearch}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      <div className="flex flex-1">
        <Sidebar
          tree={tree}
          locale={locale}
          active={category}
          onSelect={(path) => {
            setCategory(path === category ? null : path);
            setSelected(null);
            setSidebarOpen(false);
          }}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading ? (
            <p className="text-center text-gray-500 py-20">{t("loading", locale)}</p>
          ) : selected ? (
            <SkillDetail
              skill={selected}
              locale={locale}
              onBack={() => setSelected(null)}
            />
          ) : (
            <SkillGrid
              skills={filtered}
              locale={locale}
              onSelect={setSelected}
            />
          )}
        </main>
      </div>
    </div>
  );
}
