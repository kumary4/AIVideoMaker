import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, User, LogOut, Settings, CreditCard, Sparkles, Zap, Crown, Users } from "lucide-react";

export default function PremiumHeader() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });

  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/login", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      setIsLoginOpen(false);
      setLoginData({ username: '', password: '' });
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/register", data);
      return response.json();
    },
    onSuccess: () => {
      setIsRegisterOpen(false);
      setRegisterData({ username: '', email: '', password: '' });
      toast({
        title: "Account Created!",
        description: "Please log in with your credentials.",
      });
      setIsLoginOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/logout", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      navigate('/');
      toast({
        title: "Goodbye!",
        description: "You've been successfully logged out.",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  return (
    <header className="glass border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <Play className="text-white h-6 w-6 ml-0.5" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-black" />
              </div>
            </div>
            <div className="ml-4 flex flex-col">
              <span className="text-2xl font-bold text-gradient">VideoGen</span>
              <span className="text-xs text-muted-foreground">AI Video Studio</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-white transition-colors duration-200">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-white transition-colors duration-200">Pricing</a>
            <a href="#gallery" className="text-muted-foreground hover:text-white transition-colors duration-200">Gallery</a>
            <a href="#support" className="text-muted-foreground hover:text-white transition-colors duration-200">Support</a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Credits Badge */}
                <div className="glass px-4 py-2 rounded-full">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{user.credits} Credits</span>
                  </div>
                </div>

                {/* Dashboard Button */}
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="btn-premium"
                  size="sm"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Studio
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-12 w-12 rounded-2xl glass hover:bg-white/10">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 glass border-white/10" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2 p-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {user.username || user.email || "User"}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground mt-1">
                              {user.subscription === 'test-monthly' ? 'Pro Member' : 'Basic Member'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/5">
                          <span className="text-xs">Credits</span>
                          <span className="text-xs font-bold text-green-400">{user.credits}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-white/10">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/teams')} className="hover:bg-white/10">
                      <Users className="mr-3 h-4 w-4" />
                      <span>Teams</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/pricing')} className="hover:bg-white/10">
                      <CreditCard className="mr-3 h-4 w-4" />
                      <span>Upgrade Plan</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={() => logoutMutation.mutate()} className="hover:bg-white/10">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Login Dialog */}
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="hover:bg-white/10">
                      Sign In
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-gradient">Welcome Back</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="username" className="text-sm font-medium">Username or Email</Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your username or email"
                          value={loginData.username}
                          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                          className="input-premium"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="input-premium"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full btn-premium" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Register Dialog */}
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-premium">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-gradient">Create Your Account</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="reg-username" className="text-sm font-medium">Username</Label>
                        <Input
                          id="reg-username"
                          type="text"
                          placeholder="Choose a username"
                          value={registerData.username}
                          onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                          className="input-premium"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reg-email" className="text-sm font-medium">Email</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="Enter your email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          className="input-premium"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reg-password" className="text-sm font-medium">Password</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder="Create a password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          className="input-premium"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full btn-premium" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}