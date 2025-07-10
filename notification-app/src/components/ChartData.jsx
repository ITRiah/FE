import React, { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker, Spin, Alert } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "antd/dist/reset.css";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const StatisticsChart = () => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8080/api/statistics", {
        params: {
          startDate,
          endDate,
        },
      });
      if (response.data.statusCode === 200 && response.data.data) {
        setData(response.data.data);
      } else {
        setError("Không có dữ liệu");
        setData([]);
      }
    } catch (err) {
      setError("Lỗi khi tải dữ liệu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");
      setRange([dates[0], dates[1]]);
      fetchData(startDate, endDate);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Thống kê đơn hàng</h2>

      <div className="flex justify-center mb-6">
        <RangePicker
          value={range}
          onChange={handleRangeChange}
          format="YYYY-MM-DD"
          className="!w-full max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert type="error" message={error} showIcon />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StatisticsChart;
