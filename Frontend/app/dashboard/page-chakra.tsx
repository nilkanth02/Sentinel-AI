import { AppLayout } from '../components/layout/AppLayout'
import { Box, Container, Heading, VStack, HStack, SimpleGrid } from '@chakra-ui/react'
import { KpiCard } from '../components/domain/KpiCard'
import { LineChartWrapper } from '../components/charts/LineChartWrapper'
import { BarChartWrapper } from '../components/charts/BarChartWrapper'
import { RiskTable } from '../components/table/RiskTable'

export default function DashboardPage() {
  // Mock data for demonstration
  const kpiData = [
    { title: "Total Risk Score", value: "0.75", change: -5, changeType: "decrease" as const },
    { title: "Active Alerts", value: "12", change: 3, changeType: "increase" as const },
    { title: "Monitored Systems", value: "8", change: 0, changeType: "neutral" as const },
    { title: "Compliance Score", value: "92%", change: 2, changeType: "increase" as const }
  ]

  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Risk Score",
      data: [0.65, 0.72, 0.68, 0.75, 0.71, 0.78, 0.75],
      backgroundColor: "rgba(66, 153, 225, 0.2)",
      borderColor: "rgba(66, 153, 225, 1)"
    }]
  }

  const barChartData = {
    labels: ["Low", "Medium", "High", "Critical"],
    datasets: [{
      label: "Risk Distribution",
      data: [45, 28, 18, 9],
      backgroundColor: ["#48bb78", "#ed8936", "#dd6b20", "#e53e3e"],
      borderColor: ["#38a169", "#dd6b20", "#c05621", "#c53030"]
    }]
  }

  const tableColumns = [
    { key: "timestamp", header: "Time", width: "150px" },
    { key: "system", header: "System", width: "120px" },
    { key: "riskScore", header: "Risk Score", width: "100px" },
    { key: "status", header: "Status", width: "100px" }
  ]

  return (
    <AppLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Page Title */}
          <Heading size="2xl" color="gray.800">
            Risk Monitoring Dashboard
          </Heading>

          {/* KPI Cards Section */}
          <Box>
            <Heading size="lg" color="gray.700" mb={6}>
              Overview
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {kpiData.map((kpi, index) => (
                <KpiCard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  changeType={kpi.changeType}
                />
              ))}
            </SimpleGrid>
          </Box>

          {/* Charts Section */}
          <Box>
            <Heading size="lg" color="gray.700" mb={6}>
              Risk Trends
            </Heading>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <LineChartWrapper
                data={lineChartData}
                title="Risk Score Over Time"
              />
              <BarChartWrapper
                data={barChartData}
                title="Risk Categories"
              />
            </SimpleGrid>
          </Box>

          {/* Recent Activity Table */}
          <Box>
            <Heading size="lg" color="gray.700" mb={6}>
              Recent Risk Events
            </Heading>
            <RiskTable columns={tableColumns}>
              {/* Table rows would be rendered here */}
            </RiskTable>
          </Box>
        </VStack>
      </Container>
    </AppLayout>
  )
}
