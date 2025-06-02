

import React from 'react';
import AnalyticsDashboardLayout from '@/Layouts/AnalyticsDashboardLayout'
import DashboardPadding from '@/Layouts/DashboardPadding';
import {CustomAreaChart} from '../../Components/Charts/SampleChart/CustomAreaChart';
import {CustomBarChart} from '../../Components/Charts/SampleChart/CustomBarChart';
import {CustomPieChart} from '../../Components/Charts/SampleChart/CustomPieChart';
import {CustomLineChart} from '../../Components/Charts/SampleChart/CustomLineChart';


const Chart = () => {
  return (
   <AnalyticsDashboardLayout
         type='data'
         subtype='data-tables'
       >
      <DashboardPadding>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">Trend of Active Connections</h1>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div style={{ height: 250, border: '1px solid red' }}>
                <CustomAreaChart />
              </div>
              <div style={{ height: 250, border: '1px solid red' }}>
                <CustomBarChart />
              </div>
              <div style={{ height: 250, border: '1px solid red' }}>
                <CustomPieChart />
              </div>
              <div style={{ height: 250, border: '1px solid red' }}>
                <CustomLineChart />
              </div>
            </div>


        </div>
      </DashboardPadding>
    </AnalyticsDashboardLayout>
  );
};

export default Chart;
