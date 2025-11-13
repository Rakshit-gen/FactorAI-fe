import Link from 'next/link'
import { Bot, Sparkles, Zap, Brain, Shield, TrendingUp, ArrowRight, CheckCircle, Code, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative p-2.5 bg-gradient-to-br from-primary to-primary/50 rounded-xl shadow-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold">AI Agent Creator</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Create AI Agents Instantly</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Build Intelligent Agents
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Without Writing Code
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your ideas into powerful AI agents in seconds. Just describe what you need, 
              and watch AI create the perfect agent for your task.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  See Demo
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground mt-1">Agents Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground mt-1">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10ms</div>
                <div className="text-sm text-muted-foreground mt-1">Avg Response</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Build AI Agents
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make agent creation simple and efficient
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Auto-Generate Agents</CardTitle>
                <CardDescription>
                  Describe your task and AI automatically creates the perfect agent with optimal configuration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Brain className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Multiple Agent Types</CardTitle>
                <CardDescription>
                  Choose from researchers, coders, analysts, writers, and more - or create custom agents
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="p-3 bg-green-500/10 rounded-xl w-fit mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Zap className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>Instant Execution</CardTitle>
                <CardDescription>
                  Run your agents instantly with real-time results and comprehensive execution history
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Code className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>No Code Required</CardTitle>
                <CardDescription>
                  Build sophisticated AI agents without writing a single line of code
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="p-3 bg-orange-500/10 rounded-xl w-fit mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <Shield className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Enterprise-grade security with encrypted data and complete privacy protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="p-3 bg-pink-500/10 rounded-xl w-fit mb-4 group-hover:bg-pink-500/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle>Track Performance</CardTitle>
                <CardDescription>
                  Monitor agent performance with detailed analytics and execution metrics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create powerful AI agents in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Describe Your Task</h3>
              <p className="text-muted-foreground">
                Simply describe what you want to accomplish in plain language
              </p>
            </div>

            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">AI Creates Agent</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your task and builds the perfect specialized agent
              </p>
            </div>

            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Get Results</h3>
              <p className="text-muted-foreground">
                Your agent executes the task and delivers high-quality results instantly
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Every Use Case
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From research to content creation, our agents handle it all
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {[
              { icon: Brain, title: "Research & Analysis", desc: "Deep dive into any topic with comprehensive research agents" },
              { icon: Code, title: "Code Generation", desc: "Write, debug, and review code with specialized coding agents" },
              { icon: Sparkles, title: "Content Creation", desc: "Generate blog posts, articles, and marketing copy instantly" },
              { icon: TrendingUp, title: "Data Analysis", desc: "Analyze data and generate insights with analyst agents" },
            ].map((useCase, idx) => (
              <Card key={idx} className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <useCase.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="mb-2">{useCase.title}</CardTitle>
                      <CardDescription>{useCase.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="text-center py-16 px-4">
              <Rocket className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build Your First Agent?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of developers and businesses using AI Agent Creator to automate their workflows
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-semibold">AI Agent Creator</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AI Agent Creator. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}