import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Navbar } from "./components/Navbar";
import { AnimatePresence } from "framer-motion";
import { GlobalContextMenu } from "./components/CustomContextMenu"; 
import {SearchPage} from "./pages/Search/Search";
import {Stats} from "./pages/Stats/Stats";
import {AuthPage} from "./pages/Auth/Auth";
import { WorkspacePage } from "./pages/Workspace/Workspace";
export default function App() {
  const location = useLocation();

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
    >
        <div className="min-h-screen bg-[#09090b] text-foreground transition-colors duration-500">
          <Navbar />
          <GlobalContextMenu/>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/Landing" element={<Landing/>} />
              <Route path="/Auth" element={<AuthPage/>} />
              <Route path="/Search" element={<SearchPage/>} />
              <Route path="/Stats" element={<Stats/>} />
              <Route path="/WorkspacePage" element={<WorkspacePage/>} />              
            </Routes>
          </AnimatePresence>
          
        </div>
    </NextThemesProvider>
  )
}