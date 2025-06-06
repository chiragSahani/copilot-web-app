"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { motion } from "framer-motion"
import { apiClient } from "@/lib/api/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
}

// Sample data for AI model performance
const aiModelData = [
  { subject: "Accuracy", A: 85, B: 90 },
  { subject: "Speed", A: 90, B: 80 },
  { subject: "Relevance", A: 70, B: 85 },
  { subject: "Helpfulness", A: 80, B: 90 },
  { subject: "Consistency", A: 75, B: 80 },
]

// Colors for charts
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMobile()

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.getAnalyticsData()

        if (response.success && response.data) {
          setAnalyticsData(response.data)
        } else {
          setError("Failed to load analytics data")
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading Analytics
          </CardTitle>
          <CardDescription>We encountered a problem loading your analytics data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-4"} mb-4`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          {!isMobile && <TabsTrigger value="performance">Performance</TabsTrigger>}
          {!isMobile && <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div variants={item}>
              <Card className="hover-lift transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl flex items-center justify-between">
                    152
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      12%
                    </Badge>
                  </CardTitle>
                  <CardDescription>Total Conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">↑ 12%</span> from last week
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="hover-lift transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl flex items-center justify-between">
                    89%
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      4%
                    </Badge>
                  </CardTitle>
                  <CardDescription>Resolution Rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">↑ 4%</span> from last week
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="hover-lift transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl flex items-center justify-between">
                    4.2m
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      0.5m
                    </Badge>
                  </CardTitle>
                  <CardDescription>Avg. Response Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">↓ 0.5m</span> from last week
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="hover-lift transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl flex items-center justify-between">
                    4.8/5
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      0.2
                    </Badge>
                  </CardTitle>
                  <CardDescription>Customer Satisfaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">↑ 0.2</span> from last week
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div variants={item}>
              <Card className="hover-lift transition-all">
                <CardHeader>
                  <CardTitle>Conversations Overview</CardTitle>
                  <CardDescription>Weekly conversation volume and resolution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      conversations: {
                        label: "Total Conversations",
                        color: "hsl(var(--primary))",
                      },
                      resolved: {
                        label: "Resolved",
                        color: "hsl(var(--primary) / 0.5)",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData?.conversationData || []}>
                        <defs>
                          <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary) / 0.5)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary) / 0.5)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="total"
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill="url(#colorConversations)"
                        />
                        <Area
                          type="monotone"
                          dataKey="resolved"
                          stroke="hsl(var(--primary) / 0.5)"
                          fillOpacity={1}
                          fill="url(#colorResolved)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="hover-lift transition-all">
                <CardHeader>
                  <CardTitle>Conversation Categories</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Support", value: analyticsData?.categoryDistribution?.support || 45 },
                            { name: "Orders", value: analyticsData?.categoryDistribution?.orders || 30 },
                            { name: "General", value: analyticsData?.categoryDistribution?.general || 25 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: "Support", value: analyticsData?.categoryDistribution?.support || 45 },
                            { name: "Orders", value: analyticsData?.categoryDistribution?.orders || 30 },
                            { name: "General", value: analyticsData?.categoryDistribution?.general || 25 },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={item}>
            <Card className="hover-lift transition-all">
              <CardHeader>
                <CardTitle>AI Usage Metrics</CardTitle>
                <CardDescription>Performance and usage statistics for AI assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Total AI Queries</div>
                    <div className="text-2xl font-bold">{analyticsData?.aiUsageData?.totalQueries || 1250}</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Avg. Response Time</div>
                    <div className="text-2xl font-bold">{analyticsData?.aiUsageData?.averageQueryTime || 1.8}s</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">AI Accuracy</div>
                    <div className="text-2xl font-bold">{analyticsData?.aiUsageData?.aiAccuracy || 92}%</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Top AI Queries</h4>
                  <div className="space-y-2">
                    {(analyticsData?.aiUsageData?.topQueries || []).map((query: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                        <span className="text-sm">{query.query}</span>
                        <Badge variant="secondary">{query.count} queries</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <motion.div variants={item}>
            <Card className="hover-lift transition-all">
              <CardHeader>
                <CardTitle>Conversation Volume</CardTitle>
                <CardDescription>Weekly conversation trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.conversationData || []}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" name="Total Conversations" fill="hsl(var(--primary))" />
                      <Bar dataKey="resolved" name="Resolved" fill="hsl(var(--primary) / 0.5)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={item}>
              <Card className="hover-lift transition-all">
                <CardHeader>
                  <CardTitle>Resolution Rate</CardTitle>
                  <CardDescription>Percentage of resolved conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analyticsData?.conversationData?.map((item: any) => ({
                          ...item,
                          rate: ((item.resolved / item.total) * 100).toFixed(1),
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          name="Resolution Rate (%)"
                          stroke="#10b981"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="hover-lift transition-all">
                <CardHeader>
                  <CardTitle>Conversation Duration</CardTitle>
                  <CardDescription>Average time to resolution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData?.responseTimeData || []}>
                        <defs>
                          <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="time"
                          stroke="#8b5cf6"
                          fillOpacity={1}
                          fill="url(#colorTime)"
                          name="Minutes"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {!isMobile && (
          <>
            <TabsContent value="performance" className="space-y-4">
              <motion.div variants={item}>
                <Card className="hover-lift transition-all">
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                    <CardDescription>Average response time in minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData?.responseTimeData || []}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="time"
                            name="Minutes"
                            stroke="hsl(var(--primary))"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="hover-lift transition-all">
                  <CardHeader>
                    <CardTitle>Customer Satisfaction</CardTitle>
                    <CardDescription>Feedback distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Very Satisfied",
                                value: analyticsData?.satisfactionData?.verySatisfied || 40,
                              },
                              { name: "Satisfied", value: analyticsData?.satisfactionData?.satisfied || 30 },
                              { name: "Neutral", value: analyticsData?.satisfactionData?.neutral || 15 },
                              {
                                name: "Dissatisfied",
                                value: analyticsData?.satisfactionData?.dissatisfied || 10,
                              },
                              {
                                name: "Very Dissatisfied",
                                value: analyticsData?.satisfactionData?.veryDissatisfied || 5,
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              {
                                name: "Very Satisfied",
                                value: analyticsData?.satisfactionData?.verySatisfied || 40,
                              },
                              { name: "Satisfied", value: analyticsData?.satisfactionData?.satisfied || 30 },
                              { name: "Neutral", value: analyticsData?.satisfactionData?.neutral || 15 },
                              {
                                name: "Dissatisfied",
                                value: analyticsData?.satisfactionData?.dissatisfied || 10,
                              },
                              {
                                name: "Very Dissatisfied",
                                value: analyticsData?.satisfactionData?.veryDissatisfied || 5,
                              },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="ai-insights" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={item}>
                  <Card className="hover-lift transition-all">
                    <CardHeader>
                      <CardTitle>AI Model Performance</CardTitle>
                      <CardDescription>Comparison between current and previous model</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius={150} data={aiModelData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Current Model" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                            <Radar
                              name="Previous Model"
                              dataKey="B"
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.6}
                            />
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={item}>
                  <Card className="hover-lift transition-all">
                    <CardHeader>
                      <CardTitle>AI Response Quality</CardTitle>
                      <CardDescription>User feedback on AI-generated responses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: "Helpful", value: 68 },
                              { name: "Somewhat Helpful", value: 22 },
                              { name: "Not Helpful", value: 10 },
                            ]}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="Percentage (%)" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div variants={item}>
                <Card className="hover-lift transition-all">
                  <CardHeader>
                    <CardTitle>AI Usage Trends</CardTitle>
                    <CardDescription>Daily AI query volume and response times</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analyticsData?.conversationData?.map((item: any) => ({
                            date: item.date,
                            queries: Math.floor(Math.random() * 50) + 30,
                            responseTime: (Math.random() * 2 + 1).toFixed(1),
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="queries"
                            name="Queries"
                            stroke="#3b82f6"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="responseTime"
                            name="Avg. Response Time (s)"
                            stroke="#10b981"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </motion.div>
  )
}
