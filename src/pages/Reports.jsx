import { useState, useEffect } from 'react';
import { reportAPI } from '../services/api/report.api';
import { BarChart3, TrendingUp, Clock, FolderKanban } from 'lucide-react';
import { format } from 'date-fns';
import usePermissions from '../hooks/usePermissions';

const Reports = () => {
  const { canViewReports } = usePermissions();
  const [activeTab, setActiveTab] = useState('productivity');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  if (!canViewReports) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 py-16 text-center backdrop-blur-xl">
        <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-white/40 mx-auto mb-4" />
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Access Denied</h2>
        <p className="text-sm sm:text-base text-white/60">You do not have permission to view reports</p>
      </div>
    );
  }

  const [productivityData, setProductivityData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [timeTrackingData, setTimeTrackingData] = useState([]);

  useEffect(() => {
    if (activeTab === 'productivity') {
      fetchProductivityReport();
    } else if (activeTab === 'projects') {
      fetchProjectReport();
    } else if (activeTab === 'time') {
      fetchTimeTrackingReport();
    }
  }, [activeTab, filters]);

  const fetchProductivityReport = async () => {
    setIsLoading(true);
    try {
      const response = await reportAPI.getProductivityReport(filters);
      setProductivityData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching productivity report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectReport = async () => {
    setIsLoading(true);
    try {
      const response = await reportAPI.getProjectCompletionReport(filters);
      setProjectData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching project report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimeTrackingReport = async () => {
    setIsLoading(true);
    try {
      const response = await reportAPI.getTimeTrackingReport(filters);
      setTimeTrackingData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching time tracking report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const tabs = [
    { id: 'productivity', label: 'Employee Productivity', icon: TrendingUp },
    { id: 'projects', label: 'Project Completion', icon: FolderKanban },
    { id: 'time', label: 'Time Tracking', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Reports & Analytics
        </h1>
        <p className="mt-1 text-sm text-white/60">View insights and performance metrics</p>
      </div>

      {/* Date Filters */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-white/70 mb-1 sm:mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-white/70 mb-1 sm:mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-400/40 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 overflow-x-auto custom-scrollbar-dark">
        <nav className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-300'
                    : 'border-transparent text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Report Content */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        {isLoading ? (
          <div className="text-center py-12 sm:py-16 p-6">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary-400" />
            <p className="text-sm sm:text-base text-white/60">Loading report data...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Employee Productivity Report */}
            {activeTab === 'productivity' && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                  Employee Productivity Report
                </h2>
                {productivityData.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 sm:mx-0 custom-scrollbar-dark">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="text-left py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Employee</th>
                            <th className="text-right py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Total Tasks</th>
                            <th className="text-right py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Completed</th>
                            <th className="text-right py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Completion Rate</th>
                            <th className="text-right py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Est. Hours</th>
                            <th className="text-right py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Actual Hours</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white/5 divide-y divide-white/5">
                          {productivityData.map((item, index) => (
                            <tr key={index} className="hover:bg-white/10 transition-colors">
                              <td className="py-3 sm:py-4 px-3 sm:px-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500/15 rounded-full flex items-center justify-center flex-shrink-0 ring-1 ring-primary-500/30">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-300" />
                                  </div>
                                  <span className="font-medium text-white text-xs sm:text-sm truncate">
                                    {item.userName || 'Unassigned'}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 sm:py-4 px-3 sm:px-4 text-right text-white/70 text-xs sm:text-sm whitespace-nowrap">{item.totalTasks || 0}</td>
                              <td className="py-3 sm:py-4 px-3 sm:px-4 text-right text-white/70 text-xs sm:text-sm whitespace-nowrap">{item.completedTasks || 0}</td>
                              <td className="py-3 sm:py-4 px-3 sm:px-4 text-right whitespace-nowrap">
                                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-500/15 text-green-300 ring-1 ring-green-500/20">
                                  {item.completionRate?.toFixed(1) || 0}%
                                </span>
                              </td>
                              <td className="py-3 sm:py-4 px-3 sm:px-4 text-right text-white/70 text-xs sm:text-sm whitespace-nowrap">
                                {item.totalEstimatedHours?.toFixed(1) || 0}h
                              </td>
                              <td className="py-3 sm:py-4 px-3 sm:px-4 text-right text-white/70 text-xs sm:text-sm whitespace-nowrap">
                                {item.totalActualHours?.toFixed(1) || 0}h
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-white/60">No productivity data available</p>
                  </div>
                )}
              </div>
            )}

            {/* Project Completion Report */}
            {activeTab === 'projects' && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                  Project Completion Report
                </h2>
                {projectData.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {projectData.map((project, index) => (
                      <div key={index} className="border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/5 transition-shadow bg-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-white truncate">{project.name}</h3>
                            <p className="text-xs sm:text-sm text-white/60 mt-1">
                              Status: <span className="font-medium text-white/80">{project.status}</span>
                            </p>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <div className="text-xl sm:text-2xl font-bold text-primary-300">
                              {project.completionRate?.toFixed(1) || 0}%
                            </div>
                            <p className="text-xs sm:text-sm text-white/60">Completion Rate</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                          <div className="p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-xs sm:text-sm text-white/60 mb-1">Total Tasks</p>
                            <p className="text-base sm:text-lg font-semibold text-white">{project.totalTasks || 0}</p>
                          </div>
                          <div className="p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-xs sm:text-sm text-white/60 mb-1">Completed Tasks</p>
                            <p className="text-base sm:text-lg font-semibold text-green-300">{project.completedTasks || 0}</p>
                          </div>
                          <div className="p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-xs sm:text-sm text-white/60 mb-1 sm:mb-2">Progress</p>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className="bg-primary-500 h-2 rounded-full transition-all"
                                style={{ width: `${project.completionRate || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        {project.startDate && (
                          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 text-xs sm:text-sm text-white/60 flex flex-col sm:flex-row gap-1 sm:gap-0">
                            <span>Start: {format(new Date(project.startDate), 'MMM dd, yyyy')}</span>
                            {project.endDate && (
                              <span className="sm:ml-4">
                                End: {format(new Date(project.endDate), 'MMM dd, yyyy')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <FolderKanban className="w-12 h-12 sm:w-16 sm:h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-white/60">No project data available</p>
                  </div>
                )}
              </div>
            )}

            {/* Time Tracking Report */}
            {activeTab === 'time' && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                  Time Tracking Summary
                </h2>
                {timeTrackingData.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 sm:mx-0 custom-scrollbar-dark">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="text-left py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Project</th>
                            <th className="text-left py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Employee</th>
                            <th className="text-right py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Tasks</th>
                            <th className="text-right py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Est. Hours</th>
                            <th className="text-right py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Actual Hours</th>
                            <th className="text-right py-3 px-3 sm:px-4 font-semibold text-white/60 text-xs sm:text-sm">Variance</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white/5 divide-y divide-white/5">
                          {timeTrackingData.map((item, index) => {
                            const variance = item.variance || 0;
                            const varianceColor = variance > 0 ? 'text-red-300' : variance < 0 ? 'text-green-300' : 'text-white/70';
                            return (
                              <tr key={index} className="hover:bg-white/10 transition-colors">
                                <td className="py-3 sm:py-4 px-3 sm:px-4 font-medium text-white text-xs sm:text-sm whitespace-nowrap">
                                  {item.projectName || 'N/A'}
                                </td>
                                <td className="py-3 sm:py-4 px-3 sm:px-4 text-white/70 text-xs sm:text-sm whitespace-nowrap">
                                  {item.assigneeName || 'Unassigned'}
                                </td>
                                <td className="py-3 sm:py-4 px-3 sm:px-4 text-right text-white/70 text-xs sm:text-sm whitespace-nowrap">{item.taskCount || 0}</td>
                                <td className="py-3 sm:py-4 px-3 sm:px-4 text-right text-white/70 text-xs sm:text-sm whitespace-nowrap">
                                  {item.totalEstimatedHours?.toFixed(1) || 0}h
                                </td>
                                <td className="py-3 sm:py-4 px-3 sm:px-4 text-right text-white/70 text-xs sm:text-sm whitespace-nowrap">
                                  {item.totalActualHours?.toFixed(1) || 0}h
                                </td>
                                <td className={`py-3 sm:py-4 px-3 sm:px-4 text-right font-medium text-xs sm:text-sm whitespace-nowrap ${varianceColor}`}>
                                  {variance > 0 ? '+' : ''}{variance?.toFixed(1) || 0}h
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16">
                    <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-white/60">No time tracking data available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
