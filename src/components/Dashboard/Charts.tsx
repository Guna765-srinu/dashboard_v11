/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useDashboard } from "../../context/DashboardContext";
import {
  prepareTimeSeriesData,
  prepareCategoryData,
} from "../../utils/dataProcessor";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// Chart colors
const COLORS = [
  "url(#barColor)",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#a4de6c",
  "#d0ed57",
];

const Charts = () => {
  // Now include selectTicketsByCategory from context
  const {
    filteredData,
    isLoading,
    selectTicketsByCategory,
    columnMapping,
    columnLabels,
  } = useDashboard();

  // Prepare chart data
  const timeSeriesData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareTimeSeriesData(filteredData);
  }, [filteredData]);

  const technologyData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareCategoryData(
      filteredData,
      "technology",
      columnLabels,
      columnMapping
    );
  }, [filteredData, columnLabels, columnMapping]);

  const clientData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareCategoryData(
      filteredData,
      "customer",
      columnLabels,
      columnMapping
    );
  }, [filteredData, columnLabels, columnMapping]);

  const ticketTypeData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareCategoryData(
      filteredData,
      "ticketType",
      columnLabels,
      columnMapping
    );
  }, [filteredData, columnLabels, columnMapping]);

  const statusData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareCategoryData(
      filteredData,
      "state",
      columnLabels,
      columnMapping
    );
  }, [filteredData, columnLabels, columnMapping]);

  const assignedToData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareCategoryData(
      filteredData,
      "assignedTo",
      columnLabels,
      columnMapping
    );
  }, [filteredData, columnLabels, columnMapping]);

  // Add proper data preparation for assignment group, priority, and customer
  const assignmentGroupData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareCategoryData(
      filteredData,
      "assignmentGroup",
      columnLabels,
      columnMapping
    );
  }, [filteredData, columnLabels, columnMapping]);

  const priorityData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareCategoryData(
      filteredData,
      "priority",
      columnLabels,
      columnMapping
    );
  }, [filteredData, columnLabels, columnMapping]);

  const customerData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareCategoryData(
      filteredData,
      "customer",
      columnLabels,
      columnMapping
    );
  }, [filteredData, columnLabels, columnMapping]);

  const configurationItemData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareCategoryData(
      filteredData,
      "configurationItem",
      columnLabels,
      columnMapping
    );
  }, [filteredData, columnLabels, columnMapping]);

  const createdByData = React.useMemo(() => {
    if (!filteredData) return [];
    return prepareCategoryData(
      filteredData,
      "createdBy",
      columnLabels,
      columnMapping
    );
  }, [filteredData, columnLabels, columnMapping]);

  // 3D effect style for charts
  const chartStyle = {
    filter: "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))",
  };

  // Handle bar click for drill-down
  const handleBarClick = (data: any, categoryName: string) => {
    if (data && data.activeLabel) {
      selectTicketsByCategory(categoryName, data.activeLabel);
    }
  };

  // Handle pie click for drill-down
  const handlePieClick = (data: any, index: number, categoryName: string) => {
    if (data && data.name) {
      console.log(`Clicked on ${categoryName} with value ${data.name}`);
      selectTicketsByCategory(categoryName, data.name);
    }
  };

  // Handle line chart click for drill-down
  const handleLineClick = (data: any) => {
  console.log("Line chart clicked:", data.activeLabel);

  if (data?.activeLabel) {
    // Convert "2025-05-06" → "05/06/2025"
    const [year, month, day] = data.activeLabel.split("-");
    const formattedDate = `${month}/${day}/${year}`;

    // Now this will match ticket.date format
    selectTicketsByCategory("date", formattedDate);
  }
};


  //custome lagend for the pie chart
  const renderCustomLegend = (props: any) => {
    const { payload } = props; // payload contains the legend items

    return (
      <ul
        className="custom-legend-list"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                backgroundColor: entry.color,
                marginRight: 8,
                borderRadius: "50%",
              }}
            />
            <span>
              {entry.value} - {ticketTypeData[index]?.value} tickets
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Track which dashboard fields have already rendered a graph
  const renderedFields = new Set<string>();

  // Show no data message if filteredData is empty
  if (!isLoading && (!filteredData || filteredData.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Data Available
        </h3>
        <p className="text-muted-foreground max-w-md">
          No data matches your current filters. Please adjust your date range or
          filter criteria to see results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      {/* Line Chart: Tickets over time */}
      {columnMapping.startDate &&
        !renderedFields.has("startDate") &&
        (renderedFields.add("startDate"),
        (
          <Card
            className="chart-container col-span-1 md:col-span-2"
            key="startDate"
          >
            <CardHeader>
              <CardTitle>Ticket Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeSeriesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    style={chartStyle}
                    onClick={handleLineClick}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                      tickFormatter={(val) => {
                        const date = new Date(val);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                      label={{
                        value: "Ticket Count",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value} tickets`,
                        "Count",
                      ]}
                      labelFormatter={(label) =>
                        `Date: ${new Date(label).toLocaleDateString()}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tickets"
                      name="Tickets"
                      stroke="#0088FE"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}

      {/* Bar Chart: Tickets by Technology/Platform */}
      {columnMapping.technology &&
        !renderedFields.has("technology") &&
        (renderedFields.add("technology"),
        (
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>{columnLabels.technology || "Technology"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={technologyData}
                    margin={{ top: 15, right: 30, left: 20, bottom: 50 }}
                    style={chartStyle}
                    onClick={(data) => handleBarClick(data, "technology")}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 16, fill: "hsl(var(--foreground))" }}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barColor)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    >
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="hsl(var(--foreground))"
                        fontSize={17}
                        fontWeight="bold"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}

      {/* Bar Chart: Tickets by Client */}
      {columnMapping.customer &&
        !renderedFields.has("customer") &&
        (renderedFields.add("customer"),
        (
          <Card className="chart-container col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>{columnLabels.customer || "Client"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={clientData}
                    margin={{ top: 15, right: 30, left: 20, bottom: 50 }}
                    style={chartStyle}
                    onClick={(data) => handleBarClick(data, "client")}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 16, fill: "hsl(var(--foreground))" }}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barColor)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    >
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="hsl(var(--foreground))"
                        fontSize={17}
                        fontWeight="bold"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}

      {/* Pie Chart: Ticket Type distribution */}
      {columnMapping.ticketType &&
        !renderedFields.has("ticketType") &&
        (renderedFields.add("ticketType"),
        (
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>
                {columnLabels.ticketType || "Request Type Distribution"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart style={chartStyle}>
                    <Pie
                      data={ticketTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={70}
                      innerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      onClick={(data, index) =>
                        handlePieClick(data, index, "ticketType")
                      }
                    >
                      {ticketTypeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "hsl(var(--foreground))" }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}

    
      {/* Bar Chart: Created By */}
      {columnMapping.createdBy &&
        !renderedFields.has("createdBy") &&
        (renderedFields.add("createdBy"),
        (
          <Card className="chart-container col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                {columnLabels.createdBy || "Created By"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white">Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={createdByData}
                    margin={{ top: 15, right: 30, left: 20, bottom: 50 }}
                    style={chartStyle}
                    onClick={(data) => handleBarClick(data, "createdBy")}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 16, fill: "hsl(var(--foreground))" }}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barColor)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    >
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="hsl(var(--foreground))"
                        fontSize={17}
                        fontWeight="bold"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}

        
          {/* Pie Chart: Status Distribution */}
      {columnMapping.state &&
        !renderedFields.has("state") &&
        (renderedFields.add("state"),
        (
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Ticket Status
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white">Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart style={chartStyle}>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={70}
                      innerRadius={40}
                      paddingAngle={6}
                      fill="#8884d8"
                      dataKey="value"
                      onClick={(data, index) =>
                        handlePieClick(data, index, "status")
                      }
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "hsl(var(--foreground))" }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}


      {/* Bar Chart: Assignment Group */}
      {columnMapping.assignmentGroup &&
        !renderedFields.has("assignmentGroup") &&
        (renderedFields.add("assignmentGroup"),
        (
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>
                {columnLabels.assignmentGroup || "Assignment Group"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={assignmentGroupData}
                    margin={{ top: 15, right: 30, left: 20, bottom: 50 }}
                    style={chartStyle}
                    onClick={(data) => handleBarClick(data, "assignmentGroup")}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 16, fill: "hsl(var(--foreground))" }}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barColor)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    >
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="hsl(var(--foreground))"
                        fontSize={17}
                        fontWeight="bold"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}

      {/* Bar Chart: Priority */}
      {columnMapping.priority &&
        !renderedFields.has("priority") &&
        (renderedFields.add("priority"),
        (
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>{columnLabels.priority || "Priority"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={priorityData}
                    margin={{ top: 15, right: 30, left: 20, bottom: 50 }}
                    style={chartStyle}
                    onClick={(data) => handleBarClick(data, "priority")}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 16, fill: "hsl(var(--foreground))" }}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barColor)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    >
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="hsl(var(--foreground))"
                        fontSize={17}
                        fontWeight="bold"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}

      {/* Bar Chart: Priority */}
      {columnMapping.priority &&
        !renderedFields.has("priority") &&
        (renderedFields.add("priority"),
        (
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>{columnLabels.priority || "Priority"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={priorityData}
                    margin={{ top: 15, right: 30, left: 20, bottom: 50 }}
                    style={chartStyle}
                    onClick={(data) => handleBarClick(data, "priority")}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 16, fill: "hsl(var(--foreground))" }}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barColor)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    >
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="hsl(var(--foreground))"
                        fontSize={17}
                        fontWeight="bold"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}

      {/* Bar Chart: Configuration Item */}
      {columnMapping.configurationItem &&
        !renderedFields.has("configurationItem") &&
        (renderedFields.add("configurationItem"),
        (
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>
                {columnLabels.configurationItem || "Configuration Item"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={configurationItemData}
                    margin={{ top: 15, right: 30, left: 20, bottom: 50 }}
                    style={chartStyle}
                    onClick={(data) =>
                      handleBarClick(data, "configurationItem")
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 16, fill: "hsl(var(--foreground))" }}
                      angle={-30}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#barColor)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    >
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="hsl(var(--foreground))"
                        fontSize={17}
                        fontWeight="bold"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Bar Chart: Tickets by Assigned To */}
      {columnMapping.assignedTo &&
        !renderedFields.has("assignedTo") &&
        (renderedFields.add("assignedTo"),
        (
          <Card className="chart-container col-span-2 w-full">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                Assigned To
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white">Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={assignedToData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    style={chartStyle}
                    onClick={(data) => handleBarClick(data, "assignedTo")}
                  >
                    <defs>
                      {/* Optional gradient effect */}
                      <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#1e40af"
                          stopOpacity={0.9}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 16, fill: "hsl(var(--foreground))" }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis
                      tick={{ fontSize: 14, fill: "hsl(var(--foreground))" }}
                    />

                    <Bar
                      dataKey="value"
                      fill="url(#barColor)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    >
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="hsl(var(--foreground))"
                        fontSize={17}
                        fontWeight="bold"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        ))}

      {/* Graphs for each filterable field */}
      {Object.keys(columnMapping).map((field) => {
        // Only show charts for filters that are actually displayed in the sidebar
        const sidebarFilters = [
          "customer",
          "site",
          "technology",
          "configurationItem",
          "assignedTo",
          "createdBy",
          "assignmentGroup",
          "priority",
          "closedBy",
          "ticketType",
          "state",
        ];

        // Skip fields that are not in the sidebar filters
        if (!sidebarFilters.includes(field)) return null;
        if (!columnMapping[field] || renderedFields.has(field)) return null;
        renderedFields.add(field);
        // Choose chart type: pie for ticketType, bar for others
        const isPie = field === "ticketType";
        const label = columnLabels[field] || field;
        const data = prepareCategoryData(
          filteredData ?? [],
          label,
          columnLabels,
          columnMapping
        );
        const height = Math.max(350, data.length * 30);
        if (isPie) {
          return (
            <Card className="chart-container" key={field}>
              <CardHeader>
                <CardTitle>{label}</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart style={chartStyle}>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={70}
                        innerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                        onClick={(data, index) =>
                          handlePieClick(data, index, field)
                        }
                      >
                        {data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        formatter={(value) => (
                          <span style={{ color: "hsl(var(--foreground))" }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          );
        } else {
          return (
            <Card className="chart-container" key={field}>
              <CardHeader>
                <CardTitle>{label}</CardTitle>
              </CardHeader>
              <CardContent className={`h-[${height}px]`}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={height}>
                    <BarChart
                      data={data}
                      margin={{ top: 15, right: 30, left: 20, bottom: 50 }}
                      style={chartStyle}
                      onClick={(data) => handleBarClick(data, field)}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 16, fill: "hsl(var(--foreground))" }}
                        angle={-30}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="url(#barColor)"
                        radius={[6, 6, 0, 0]}
                        animationDuration={800}
                      >
                        <LabelList
                          dataKey="value"
                          position="top"
                          fill="hsl(var(--foreground))"
                          fontSize={17}
                          fontWeight="bold"
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          );
        }
      })}
    </div>
  );
};
export default Charts;
