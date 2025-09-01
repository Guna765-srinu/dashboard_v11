import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { useDashboard } from '../../context/DashboardContext';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Filter,
  Upload,
  CalendarIcon,
} from 'lucide-react';
import FileUpload from './FileUpload';
import MultiSelect from '../ui/MultiSelect';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const {
    filters,
    uniqueValues,
    updateFilters,
    resetFilters,
    applyFilters,
    columnMapping,
    columnLabels,
  } = useDashboard();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const [localFilters, setLocalFilters] = useState(filters);
  const [shouldApply, setShouldApply] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (shouldApply) {
      applyFilters();
      setShouldApply(false);
    }
  }, [filters, shouldApply, applyFilters]);

  const handleFilterChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    updateFilters(localFilters);
    setShouldApply(true);
  };

  const handleResetFilters = () => {
    resetFilters();
    setLocalFilters(filters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (val) => (Array.isArray(val) ? val.length > 0 : !!val)
  );

  const uploadHighlight = filters.uploadedFile;

  return (
    <aside
      className={`transition-all duration-300 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen overflow-y-auto p-4 flex flex-col gap-6 shadow-sm
        ${isOpen ? 'w-64' : 'w-20'}`}
    >
      {/* Expand/Collapse Button */}
      <div className="flex justify-end">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-sidebar-border transition"
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
      </div>

      {/* File Upload */}
      <div className={`flex items-center gap-2 p-1 rounded ${uploadHighlight ? 'green-500' : ''}`}>
        <Upload size={20} className={uploadHighlight ? 'text-green-500' : ''} />
        <div className={`transition-all duration-300 ${isOpen ? 'flex-1' : 'hidden'}`}>
          <FileUpload />
        </div>
      </div>

      {/* Filters */}
      <div className={`flex flex-col gap-4 p-1 rounded ${hasActiveFilters ? 'blue-500' : ''}`}>
        <div className="flex items-center gap-3">
          <Filter size={20} className={hasActiveFilters ? 'text-blue-500' : ''} />
          {isOpen && <span className="text-lg font-semibold">Filters</span>}
        </div>

        {isOpen && (
          <>
            {/* Date Filters */}
            <div className="space-y-4">
              {columnMapping.startDate && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !localFilters.startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.startDate ? format(localFilters.startDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover" align="start">
                      <Calendar
                        mode="single"
                        selected={localFilters.startDate}
                        onSelect={(date) => date && handleFilterChange('startDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {columnMapping.endDate && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !localFilters.endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters.endDate ? format(localFilters.endDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover" align="start">
                      <Calendar
                        mode="single"
                        selected={localFilters.endDate}
                        onSelect={(date) => date && handleFilterChange('endDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="space-y-4">
              {Object.keys(columnMapping).map((key) => {
                if (['startDate', 'endDate'].includes(key)) return null;
                const options = uniqueValues[key];
                const label = columnLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  options && (
                    <MultiSelect
                      key={key}
                      label={label}
                      options={options}
                      selected={localFilters[key] || []}
                      onChange={(values) => handleFilterChange(key, values)}
                    />
                  )
                );
              })}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={handleApplyFilters}
                size="lg"
                className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              >
                Apply
              </Button>

              <Button
                onClick={handleResetFilters}
                variant="outline"
                size="lg"
                className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              >
                Show All
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {isOpen && (
        <div className="mt-auto text-xs text-sidebar-foreground/50 text-center">
          it soli Dashboard v1.0
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
