import React from 'react'
import {  Line , Doughnut} from "react-chartjs-2";

import { Chart as Chartjs } from 'react-chartjs-2';

Chartjs.register()

function LineChart() {
  return (
    <Line data={{
      
    }} />
  )
}
function DoughnutChart() {
  return (
    <div>Chart</div>
  )
}

export  {LineChart , DoughnutChart}