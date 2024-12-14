import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  completionFilter: string;
  setCompletionFilter: (filter: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  difficulties: { name: string; variant: string }[];
  completionStates: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  categoriesWithIcons: { name: string; icon: React.ComponentType<{ className?: string }> }[];
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDifficulty,
  setSelectedDifficulty,
  completionFilter,
  setCompletionFilter,
  selectedCategory,
  setSelectedCategory,
  difficulties,
  completionStates,
  categoriesWithIcons,
}) => {
  return (
    <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
      <ScrollArea className="h-full">
        <div className="space-y-6 p-4 bg-card rounded-xl border shadow-sm">
          {/* Search Bar */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search problems..."
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Difficulty Tabs */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Difficulty</Label>
            <Tabs
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 h-9">
                {difficulties.map((diff) => (
                  <TabsTrigger
                    key={diff.name}
                    value={diff.name}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {diff.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Separator />

          {/* Status Radio Group */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <RadioGroup
              value={completionFilter}
              onValueChange={setCompletionFilter}
              className="flex flex-col space-y-2"
            >
              {completionStates.map((state) => (
                <div
                  key={state.value}
                  className="flex items-center space-x-2 rounded-lg hover:bg-accent p-2 transition-colors"
                >
                  <RadioGroupItem value={state.value} id={state.value} />
                  <Label
                    htmlFor={state.value}
                    className="flex items-center flex-1 cursor-pointer"
                  >
                    {React.createElement(state.icon, { className: "mr-2 h-4 w-4 text-primary" })}
                    {state.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Category Grid */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {categoriesWithIcons.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  className={cn(
                    "flex items-center justify-start gap-2 h-auto py-2 px-3 transition-all",
                    selectedCategory === category.name &&
                      "bg-primary text-primary-foreground",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {React.createElement(category.icon, { className: "h-4 w-4" })}
                  <span className="text-sm truncate">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default FiltersPanel;
