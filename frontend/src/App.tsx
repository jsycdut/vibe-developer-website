import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import NotesListPage from "./pages/NotesListPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import PortfolioPage from "./pages/PortfolioPage";
import AboutPage from "./pages/AboutPage";
import ChatPage from "./pages/ChatPage";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminNotesPage from "./pages/AdminNotesPage";
import AdminChatPage from "./pages/AdminChatPage";
import AdminUsersPage from "./pages/AdminUsersPage";

export default function App() {
	return (
		<Routes>
			{/* 前台公开路由 */}
			{/*
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NotesListPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
				*/}

			{/* 独立聊天页（无导航栏） */}
			{/*<Route path="/chat" element={<ChatPage />} />*/}

			{/* 后台登录 */}
			<Route path="/admin/login" element={<AdminLoginPage />} />

			{/* 后台管理（需要登录） */}
			<Route
				path="/admin"
				element={
					<ProtectedRoute roles={["ADMIN", "EDITOR", "CHATTER"]}>
						<AdminLayout />
					</ProtectedRoute>
				}
			>
				<Route
					path="notes"
					element={
						<ProtectedRoute roles={["ADMIN", "EDITOR"]}>
							<AdminNotesPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="chat"
					element={
						<ProtectedRoute roles={["ADMIN", "CHATTER"]}>
							<AdminChatPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="users"
					element={
						<ProtectedRoute roles={["ADMIN"]}>
							<AdminUsersPage />
						</ProtectedRoute>
					}
				/>
				<Route index element={<Navigate to="/admin/login" replace />} />
			</Route>

			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
