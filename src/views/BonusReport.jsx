import React, { useEffect, useState } from "react";
import { getBonusReport } from "../repository/BonusRepository";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useSelector } from "react-redux";

const BonusReport = () => {
  let [totalPages, setTotalPages] = useState(10);
  let [currentPage, setCurrentPage] = useState(1);
  let [bonusReport, setBonusReport] = useState([]);
  let [loading, setLoading] = useState(false);

  let [totalPlayed, setTotalPlayed] = useState(0);
  let [totalCommission, setTotalCommission] = useState(0);
  let [remainingCommission, setRemainingCommission] = useState(0);

  let { appData } = useSelector(state => state.appData.appData);

  useEffect(() => {
    document.title = "Bonus Report | Morvi Nnandan"
  }, [])


  const fetchBonusReport = async () => {
    try {
      setLoading(true);
      let { data } = await getBonusReport({
        page: currentPage,
      });
      if (data.error == false) {
        setBonusReport(data.response.date_wise_play_amount);
        setTotalPlayed(data.response.total_play_amount);
        setTotalCommission(data.response.total_commission);
        setRemainingCommission(data.response.remaining_commission);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBonusReport();
  }, [currentPage]);
  return (
    <div className="pb-8">
      <div className="flex p-3 text-white bg-primary">
        <div className="flex flex-col text-sm">
          <h4 className="text-lg font-semibold text-center text-white">
            Bonus Report
          </h4>
          <div className="mt-2">Total Played: {totalPlayed}</div>
          <div>Total Commission: {totalCommission}</div>
          <div>Remaining Commission: {remainingCommission}</div>
          <label className="mt-3 font-semibold">
            Enter Redeem Amount (Min - {appData.min_withdraw})
          </label>
          <input
            className="h-10 px-2 py-1 mt-1 text-black border-0 rounded"
            type="text"
            placeholder="Enter Amount"
          />
        </div>
      </div>
      {/* <div className="flex p-3 text-sm">
        <div className="flex items-center gap-1">
          <small>Show</small>
          <select className="p-1 text-sm border rounded-sm border-black/80">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <small>entries</small>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <small>Search</small>
          <input
            type="text"
            className="p-1 w-[150px] text-sm border rounded-sm border-black/80"
          />
        </div>
      </div> */}
      <div className="w-full overflow-auto">
        <table className="w-full text-xs table-auto">
          <thead className="bg-greenLight">
            <tr>
              <th className="p-0.5">Date</th>
              <th className="p-0.5">Total Played</th>
              <th className="p-0.5">Comm</th>
            </tr>
          </thead>
          <tbody>
            {bonusReport.map(bonusReportItem => (
              <tr className="text-center">
                <td className="p-1">{bonusReportItem.date}</td>
                <td className="p-1">{bonusReportItem.play_amount}</td>
                <td className="p-1">{bonusReportItem.commission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && bonusReport.length === 0 && <div className="pt-3"><Spinner /></div>}
      {!loading && bonusReport.length === 0 &&
        <div className="w-full p-2 font-semibold text-center">No Data Found</div>
      }
    </div>
  );
};

export default BonusReport;
