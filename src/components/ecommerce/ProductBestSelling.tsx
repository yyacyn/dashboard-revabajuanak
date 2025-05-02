import React from 'react'
import { Search } from 'lucide-react'

function ProductBestSelling() {
  return (
    <div className='bg-white shadow-md rounded-xl p-6 dark:bg-white/[0.03] dark:text-gray-200'>
      <div className="flex items-center justify-between mb-6">
        <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Best Selling Products</h2>
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className='w-full table-auto text-sm text-left'>
          <thead className='bg-gray-100 text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-200'>
            <tr>
              <th className='px-4 py-3'>Image</th>
              <th className='px-4 py-3'>Name</th>
              <th className='px-4 py-3'>Description</th>
              <th className='px-4 py-3'>Category</th>
              <th className='px-4 py-3'>Price</th>
              <th className='px-4 py-3'>Quantity</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b hover:bg-gray-5'>
              <td className='px-4 py-3'>
                <div className="w-12 h-12 rounded overflow-hidden">
                  <img src="./images/user/atmint.jpg" alt="Product" />
                </div>
              </td>
              <td className='px-4 py-3'>fufufafa 1</td>
              <td className='px-4 py-3 whitespace-normal break-words max-w-[150px]'>fufufafa adalah</td>
              <td className='px-4 py-3'>fufafufa</td>
              <td className='px-4 py-3'>50.000</td>
              <td className='px-4 py-3'>5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductBestSelling
