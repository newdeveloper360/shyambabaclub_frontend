import React, { useEffect, useState } from "react";
import { getTransactionHistory } from "../repository/HistoryRepository";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import moment from "moment";
import { useSelector } from "react-redux";

const Passbook = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(false);
  const [perPageRecords, setPerPageRecords] = useState(50);
  const [transactions, setTransactions] = useState([]);
  const { user } = useSelector((state) => state.appData.appData);

  useEffect(() => {
    document.title = "Passbook | Morvi Nnandan";
  }, []);

  const fetchTransactionHistory = async (page) => {
    try {
      setDataLoading(true);
      const { data } = await getTransactionHistory({ page });
      if (data.error === false) {
        const paginated = data.response?.transactions || {};
        setTransactions(paginated.data || []);
        setLastPage(paginated.last_page || 1);
        setPerPageRecords(paginated.per_page || 50);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory(currentPage);
  }, [currentPage]);

  const isCredit = (item) => {
    const type = String(item.type || "").toLowerCase();
    if (["credit", "deposit", "win", "bonus", "transfer_in"].includes(type)) {
      return true;
    }
    if (["debit", "withdraw", "play", "transfer_out"].includes(type)) {
      return false;
    }
    return Number(item.current_amount) >= Number(item.previous_amount);
  };

  return (
    <div className="pb-8">
      <div className="p-3 text-white bg-primary">
        <h4 className="text-lg font-semibold text-center">Passbook</h4>
        <p className="mt-1 text-xs text-center opacity-90">
          अपने सारे ट्रांजेक्शन का पूरा ब्यौरा
        </p>
        <div className="mt-2 text-sm text-center">
          Current Balance: {user?.balance ?? 0}
        </div>
      </div>
      <div className="w-full overflow-auto">
        <table className="w-full text-xs table-auto">
          <thead className="bg-greenLight">
            <tr>
              <th className="p-0.5">Sn</th>
              <th className="p-0.5">Previous Amount</th>
              <th className="p-0.5">Amount</th>
              <th className="p-0.5">Current Amount</th>
              <th className="p-0.5">Type</th>
              <th className="p-0.5">Details</th>
              <th className="p-0.5">Date</th>
            </tr>
          </thead>
          {!dataLoading && (
            <tbody>
              {transactions.map((item, idx) => {
                const credit = isCredit(item);
                return (
                  <tr key={item.id || idx} className="text-center">
                    <td className="p-1">
                      {idx + 1 + (currentPage - 1) * perPageRecords}
                    </td>
                    <td className="p-1">{item.previous_amount}</td>
                    <td
                      className={`p-1 font-semibold ${
                        credit ? "passbook-amount-credit" : "passbook-amount-debit"
                      }`}
                    >
                      {credit ? "+" : "-"}
                      {item.amount}
                    </td>
                    <td className="p-1 font-semibold">{item.current_amount}</td>
                    <td className="p-1 capitalize">{item.type || "-"}</td>
                    <td className="p-1">{item.details || "-"}</td>
                    <td className="p-1 whitespace-nowrap">
                      {item.created_at
                        ? moment(item.created_at).format("DD-MM-YYYY hh:mm A")
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>
      {dataLoading && (
        <div className="flex justify-center w-full p-4">
          <div className="grid w-full place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
            <svg
              className="text-gray-300 animate-spin"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path
                d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              ></path>
            </svg>
          </div>
        </div>
      )}
      {!dataLoading && transactions.length === 0 ? (
        <div className="w-full p-2 font-semibold text-center">No Data Found</div>
      ) : (
        ""
      )}
      {!dataLoading && transactions.length > 0 && (
        <div className="pb-4">
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Passbook;
