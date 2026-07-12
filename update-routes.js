const fs = require('fs');
const appPath = './src/App.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

// 1. Add useAuth import
appCode = appCode.replace("import { AuthProvider } from './context/AuthContext'", "import { AuthProvider, useAuth } from './context/AuthContext'");

// 2. Add ChatRoute component
const chatRouteCode = `
function ChatRoute() {
  const { user } = useAuth()
  return user ? <DashboardLayout noPadding><Chat /></DashboardLayout> : <Chat />
}

function AppContent() {
`;
appCode = appCode.replace('function AppContent() {', chatRouteCode);

// 3. Update AppContent to use useAuth and modify isProtected
appCode = appCode.replace('  const location = useLocation()', '  const { user } = useAuth()\n  const location = useLocation()');
appCode = appCode.replace('const isProtected = isProtectedRoute(location.pathname)', 'const isProtected = isProtectedRoute(location.pathname) || (user && isChatPage)');

// 4. Update Chat routes
appCode = appCode.replace('<Route path="/chat" element={<PublicRoute redirectTo="/dashboard/chat"><Chat /></PublicRoute>} />', '<Route path="/chat" element={<ChatRoute />} />');
appCode = appCode.replace('<Route path="/chat/:id" element={<PublicRoute redirectTo="/dashboard/chat"><Chat /></PublicRoute>} />', '<Route path="/chat/:id" element={<ChatRoute />} />');

// 5. Remove /dashboard/chat routes
appCode = appCode.replace('          <Route path="/dashboard/chat" element={<ProtectedRoute><DashboardLayout noPadding><Chat /></DashboardLayout></ProtectedRoute>} />\n', '');
appCode = appCode.replace('          <Route path="/dashboard/chat/:id" element={<ProtectedRoute><DashboardLayout noPadding><Chat /></DashboardLayout></ProtectedRoute>} />\n', '');

fs.writeFileSync(appPath, appCode);
