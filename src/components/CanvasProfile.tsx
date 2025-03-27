
/**
 * Canvas profiling component
 * Displays rendering metrics for canvas operations
 * @module CanvasProfile
 */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { PerformanceMeasurement } from '@/utils/performance';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Maximum number of measurements to store in the profile history
 * @constant {number}
 */
const MAX_MEASUREMENTS = 100;

/**
 * Type for average duration calculations
 * @interface AverageDuration
 */
interface AverageDuration {
  /** Operation name */
  name: string;
  /** Average duration in milliseconds */
  avgDuration: number;
  /** Number of samples collected */
  count: number;
}

/**
 * Type for chart data points
 * @interface ChartDataPoint
 */
interface ChartDataPoint {
  /** Index in the data array */
  index: number;
  /** Operation name */
  name: string;
  /** Operation duration in milliseconds */
  duration: number;
}

/**
 * Canvas profiling panel component
 * Displays performance metrics for canvas operations
 * @returns {JSX.Element} Performance monitoring UI
 */
export const CanvasProfile = () => {
  const [measurements, setMeasurements] = useState<PerformanceMeasurement[]>([]);
  const [recording, setRecording] = useState(false);
  const [selectedTab, setSelectedTab] = useState("metrics");
  
  /**
   * Toggle recording state
   * Starts or stops the performance recording
   */
  const toggleRecording = () => {
    setRecording(prev => !prev);
    
    if (!recording) {
      // Clear previous measurements when starting a new recording
      setMeasurements([]);
    }
  };
  
  /**
   * Add a new measurement to the profile
   * @param {PerformanceMeasurement} measurement - The performance measurement to add
   */
  const addMeasurement = (measurement: PerformanceMeasurement) => {
    setMeasurements(prev => {
      const newMeasurements = [...prev, measurement];
      // Keep only the most recent measurements
      return newMeasurements.slice(-MAX_MEASUREMENTS);
    });
  };
  
  /**
   * Calculate average duration by operation
   * @returns {AverageDuration[]} Array of operation averages
   */
  const getAverageDurations = (): AverageDuration[] => {
    const operationMap = new Map<string, { total: number, count: number }>();
    
    measurements.forEach(m => {
      const current = operationMap.get(m.name) || { total: 0, count: 0 };
      operationMap.set(m.name, {
        total: current.total + m.duration,
        count: current.count + 1
      });
    });
    
    return Array.from(operationMap.entries()).map(([name, { total, count }]) => ({
      name,
      avgDuration: total / count,
      count
    }));
  };
  
  /**
   * Prepare chart data for visualization
   * @returns {ChartDataPoint[]} Array of data points for the chart
   */
  const getChartData = (): ChartDataPoint[] => {
    return measurements.map((m, index) => ({
      index,
      name: m.name,
      duration: m.duration
    }));
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Canvas Performance Metrics</CardTitle>
          <Button 
            size="sm" 
            variant={recording ? "destructive" : "default"}
            onClick={toggleRecording}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics">
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2">
                {getAverageDurations().map(({ name, avgDuration, count }) => (
                  <div key={name} className="bg-gray-50 p-3 rounded shadow-sm">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-lg font-bold">{avgDuration.toFixed(2)}ms</p>
                    <Badge variant="outline">{count} samples</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chart">
            <div className="h-64">
              {measurements.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value}ms`, 'Duration']}
                      labelFormatter={(index: number) => measurements[index]?.name || ''}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="duration" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="operations">
            <div className="overflow-auto max-h-64">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Operation</th>
                    <th className="text-left py-2">Duration</th>
                    <th className="text-left py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.slice().reverse().map((m, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{m.name}</td>
                      <td className="py-2">{m.duration.toFixed(2)}ms</td>
                      <td className="py-2">{new Date(m.startTime).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
