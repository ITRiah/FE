import React, { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';

const DateRangeForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownload = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                'http://localhost:8080/api/v1/download',
                { startDate, endDate }, // POST body
                { responseType: 'blob' } // Axios config
            );

            const now = format(new Date(), 'yyyyMMdd_HHmmss');
            const fileName = `excel_${now}.xlsx`;

            saveAs(response.data, fileName);
        } catch (err) {
            setError('Không thể tải file. Vui lòng kiểm tra ngày và thử lại.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Tải Báo Cáo Excel</h2>
            <form onSubmit={handleDownload} className="space-y-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Ngày Bắt Đầu
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        Ngày Kết Thúc
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        required
                    />
                </div>
                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-200"
                >
                    {isLoading ? 'Đang Tải...' : 'Tải Excel'}
                </button>
            </form>
        </div>
    );
};

export default DateRangeForm;