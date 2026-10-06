import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './features/auth/components/RequireAuth.jsx'
import { AuthScreen } from './features/auth/screens/AuthScreen.jsx'
import { AuditUploadScreen } from './features/auditor/screens/AuditUploadScreen.jsx'
import { DashboardOverviewScreen } from './features/report/screens/DashboardOverviewScreen.jsx'
import { ReportDetailScreen } from './features/report/screens/ReportDetailScreen.jsx'
import { FormalCertificateScreen } from './features/verification/screens/FormalCertificateScreen.jsx'
import { VerifyPublicHashScreen } from './features/verification/screens/VerifyPublicHashScreen.jsx'
import { MainLayout } from './shared/layout/MainLayout.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthScreen mode="login" />} />
      <Route path="/register" element={<AuthScreen mode="register" />} />
      <Route element={<RequireAuth />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/audit" replace />} />
          <Route path="/audit" element={<AuditUploadScreen />} />
          <Route path="/reports" element={<DashboardOverviewScreen />} />
          <Route path="/reports/:reportId" element={<ReportDetailScreen />} />
          <Route
            path="/reports/:reportId/certificate"
            element={<FormalCertificateScreen />}
          />
        </Route>
      </Route>
      <Route path="/verify/:hash" element={<VerifyPublicHashScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
