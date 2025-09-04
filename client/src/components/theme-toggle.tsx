import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300"
      data-testid="button-theme-toggle"
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 1 : 0,
          opacity: theme === "dark" ? 1 : 0,
          rotate: theme === "dark" ? 0 : 180,
        }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          scale: theme === "light" ? 1 : 0,
          opacity: theme === "light" ? 1 : 0,
          rotate: theme === "light" ? 0 : -180,
        }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="h-4 w-4 text-orange-500" />
      </motion.div>
    </Button>
  );
}