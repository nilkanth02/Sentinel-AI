"use client"

import { AppLayoutModern } from '../components/layout/AppLayoutModern'
import { Button, Switch, Separator, Input, Label } from '@/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { useCursorInteractions } from '@/hooks/useCursorInteractions'
import { 
  MotionCard,
  staggerContainer,
  slideUp,
  hoverScaleLift,
  hoverGlow,
  buttonPress
} from '@/components/ui/motion'

export default function SettingsPageModern() {
  const { registerInteractiveElement } = useCursorInteractions()
  return (
    <AppLayoutModern>
      <div className="min-h-screen bg-gradient-navy">
        {/* Premium animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        
        <div className="relative z-10 space-y-8 p-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-2"
          >
            <motion.h1 variants={slideUp} className="text-3xl font-bold tracking-tight text-foreground">Settings</motion.h1>
            <motion.p variants={slideUp} className="text-muted">Configure the brain of your AI safety system</motion.p>
          </motion.div>

          {/* Settings Sections */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* General Settings */}
            <MotionCard variants={slideUp} className="card-premium p-6" {...hoverGlow}>
              <h2 className="text-xl font-semibold text-foreground mb-4">General Settings</h2>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center justify-between"
                  {...hoverScaleLift}
                >
                  <div className="space-y-1">
                    <Label htmlFor="email-notifications" className="text-foreground">Email Notifications</Label>
                    <p className="text-sm text-muted">Receive email alerts for critical events</p>
                  </div>
                  <Switch id="email-notifications" className="data-[state=checked]:bg-electric-blue" />
                </motion.div>
                
                <Separator className="bg-white/10" />
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center justify-between"
                  {...hoverScaleLift}
                >
                  <div className="space-y-1">
                    <Label htmlFor="auto-refresh" className="text-foreground">Auto-refresh</Label>
                    <p className="text-sm text-muted">Automatically refresh dashboard data</p>
                  </div>
                  <Switch id="auto-refresh" className="data-[state=checked]:bg-electric-blue" />
                </motion.div>
                
                <Separator className="bg-white/10" />
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="timezone" className="text-foreground">Time Zone</Label>
                  <Select>
                    <SelectTrigger className="input-premium">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className="card-premium border-white/10">
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">EST</SelectItem>
                      <SelectItem value="pst">PST</SelectItem>
                      <SelectItem value="ist">IST</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </MotionCard>

            {/* Security Settings */}
            <MotionCard variants={slideUp} className="card-premium p-6" {...hoverGlow}>
              <h2 className="text-xl font-semibold text-foreground mb-4">Security Settings</h2>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center justify-between"
                  {...hoverScaleLift}
                >
                  <div className="space-y-1">
                    <Label htmlFor="two-factor" className="text-foreground">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted">Add an extra layer of security</p>
                  </div>
                  <Switch id="two-factor" className="data-[state=checked]:bg-electric-violet" />
                </motion.div>
                
                <Separator className="bg-white/10" />
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex items-center justify-between"
                  {...hoverScaleLift}
                >
                  <div className="space-y-1">
                    <Label htmlFor="session-timeout" className="text-foreground">Session Timeout</Label>
                    <p className="text-sm text-muted">Automatically log out after inactivity</p>
                  </div>
                  <Switch id="session-timeout" className="data-[state=checked]:bg-electric-violet" />
                </motion.div>
                
                <Separator className="bg-white/10" />
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-foreground">Change Password</Label>
                  <Input type="password" id="password" placeholder="Enter new password" className="input-premium" />
                </motion.div>
              </div>
            </MotionCard>

            {/* Risk Assessment Settings */}
            <MotionCard variants={slideUp} className="card-premium p-6" {...hoverGlow}>
              <h2 className="text-xl font-semibold text-foreground mb-4">Risk Assessment</h2>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="risk-threshold" className="text-foreground">Risk Threshold</Label>
                  <Select>
                    <SelectTrigger className="input-premium">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent className="card-premium border-white/10">
                      <SelectItem value="low">Low (0.3)</SelectItem>
                      <SelectItem value="medium">Medium (0.5)</SelectItem>
                      <SelectItem value="high">High (0.7)</SelectItem>
                      <SelectItem value="critical">Critical (0.9)</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                
                <Separator className="bg-white/10" />
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center justify-between"
                  {...hoverScaleLift}
                >
                  <div className="space-y-1">
                    <Label htmlFor="ai-detection" className="text-foreground">AI-Powered Detection</Label>
                    <p className="text-sm text-muted">Use advanced AI for risk analysis</p>
                  </div>
                  <Switch id="ai-detection" defaultChecked className="data-[state=checked]:bg-electric-blue" />
                </motion.div>
                
                <Separator className="bg-white/10" />
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex items-center justify-between"
                  {...hoverScaleLift}
                >
                  <div className="space-y-1">
                    <Label htmlFor="real-time" className="text-foreground">Real-time Monitoring</Label>
                    <p className="text-sm text-muted">Monitor risks in real-time</p>
                  </div>
                  <Switch id="real-time" defaultChecked className="data-[state=checked]:bg-electric-blue" />
                </motion.div>
              </div>
            </MotionCard>

            {/* Notification Settings */}
            <MotionCard variants={slideUp} className="card-premium p-6" {...hoverGlow}>
              <h2 className="text-xl font-semibold text-foreground mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center justify-between"
                  {...hoverScaleLift}
                >
                  <div className="space-y-1">
                    <Label htmlFor="critical-alerts" className="text-foreground">Critical Alerts</Label>
                    <p className="text-sm text-muted">Immediate notifications for critical risks</p>
                  </div>
                  <Switch id="critical-alerts" defaultChecked className="data-[state=checked]:bg-electric-blue" />
                </motion.div>
                
                <Separator className="bg-white/10" />
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex items-center justify-between"
                  {...hoverScaleLift}
                >
                  <div className="space-y-1">
                    <Label htmlFor="weekly-reports" className="text-foreground">Weekly Reports</Label>
                    <p className="text-sm text-muted">Receive weekly risk summary reports</p>
                  </div>
                  <Switch id="weekly-reports" className="data-[state=checked]:bg-electric-blue" />
                </motion.div>
                
                <Separator className="bg-white/10" />
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex items-center justify-between"
                  {...hoverScaleLift}
                >
                  <div className="space-y-1">
                    <Label htmlFor="browser-notifications" className="text-foreground">Browser Notifications</Label>
                    <p className="text-sm text-muted">Show desktop notifications</p>
                  </div>
                  <Switch id="browser-notifications" className="data-[state=checked]:bg-electric-blue" />
                </motion.div>
              </div>
            </MotionCard>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex justify-end space-x-4 pt-6"
          >
            <motion.div {...buttonPress}>
              <Button variant="outline" className="btn-premium-outline">Cancel</Button>
            </motion.div>
            <motion.div {...buttonPress}>
              <Button className="btn-premium">Save Changes</Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AppLayoutModern>
  )
}
