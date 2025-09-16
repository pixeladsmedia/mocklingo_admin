import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/components/providers/theme-provider"
// At the top of Login.js, use these exact imports:
import { clearError, checkLogin } from '../store/authSlice'
import { loginAdmin } from '../api/authApi'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { theme } = useTheme()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Get state from Redux
  const { isLoading, error, isLoggedIn } = useSelector((state) => state.auth)

  // Check if user is already logged in on component mount
  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  // If logged in, go to dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    // Clear error when user types
    if (error) {
      dispatch(clearError())
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    // Clear error when user types
    if (error) {
      dispatch(clearError())
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!username || !password) {
      return
    }

    // Call Redux login action
    dispatch(loginAdmin(username, password))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mocklingo-dark via-secondary to-mocklingo-dark p-4">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-mocklingo-dark/20 via-transparent to-mocklingo-dark/20 pointer-events-none" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-border/50 bg-background/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <div className="text-2xl font-bold text-primary">MOCKLINGO</div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your admin account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={handleUsernameChange}
                  className="pl-9"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-9 pr-9"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                disabled={isLoading}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>

            <div className="text-center space-y-2">
              <Button variant="link" className="p-0 h-auto text-sm">
                Forgot your password?
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="text-center text-sm text-muted-foreground">
              Demo credentials: Enter your admin username and password
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
