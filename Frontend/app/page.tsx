'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Shield, BarChart3, FileText, ArrowRight, Lock, Zap, Globe } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter:blur(0.75px)]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">SentinelAI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
          </nav>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              AI Safety Monitoring
              <span className="block text-primary">Made Simple</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              Real-time risk assessment, intelligent threat detection, and comprehensive compliance monitoring 
              for your AI applications. Protect your users and your business with SentinelAI.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="px-8" asChild>
                <Link href="/dashboard">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything You Need for AI Safety
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive monitoring and protection features powered by advanced AI
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Real-time Monitoring</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Continuous monitoring of AI interactions with instant risk assessment and alerting
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Advanced Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Detailed insights and trends about your AI safety metrics and compliance status
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Enterprise Security</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Bank-grade encryption and compliance with industry standards and regulations
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Lightning Fast</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sub-millisecond response times with optimized performance for high-volume applications
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Global Coverage</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Multi-region deployment with localized compliance for international markets
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Compliance Reports</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Automated generation of compliance reports for audits and regulatory requirements
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How SentinelAI Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in minutes with our simple three-step process
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold">Integrate</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add our SDK to your application with just a few lines of code
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold">Configure</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Set your safety thresholds and monitoring preferences
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold">Monitor</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get real-time alerts and insights through your dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Simple Pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">Start free, upgrade when you’re ready.</p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
            <Card className="p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold">Starter</h3>
                  <p className="mt-1 text-sm text-muted-foreground">For early experiments</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">$0</div>
                  <div className="text-sm text-muted-foreground">/ month</div>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <div>Basic risk scoring</div>
                <div>Limited logs retention</div>
                <div>Email alerts</div>
              </div>
              <div className="mt-8">
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-8 border-primary/30">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold">Pro</h3>
                  <p className="mt-1 text-sm text-muted-foreground">For production teams</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">$49</div>
                  <div className="text-sm text-muted-foreground">/ month</div>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <div>Advanced analytics</div>
                <div>Higher throughput</div>
                <div>Team access</div>
              </div>
              <div className="mt-8">
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Start Pro</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold">Enterprise</h3>
                  <p className="mt-1 text-sm text-muted-foreground">For scale & compliance</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">Custom</div>
                  <div className="text-sm text-muted-foreground">Talk to sales</div>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <div>SLA + SSO</div>
                <div>Custom policies</div>
                <div>Dedicated support</div>
              </div>
              <div className="mt-8">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard">Contact Sales</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <Card className="mx-auto max-w-2xl bg-gradient-to-r from-primary/10 to-primary/5 p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Ready to Secure Your AI?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of companies trusting SentinelAI for their AI safety needs
            </p>
            <div className="mt-8">
              <Button size="lg" className="px-8" asChild>
                <Link href="/dashboard">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold">SentinelAI</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Making AI safety accessible and reliable for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Product</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Support</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SentinelAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
