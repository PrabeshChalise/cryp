import React, { useState, useEffect } from "react";
import axios from "axios";

const WithdrawList = () => {
  const [clients, setClients] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("https://trcnfx.com/api/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleViewWithdraws = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://trcnfx.com/api/send1/${id}`);
      setWithdraws(response.data);
      setSelectedUserId(id);
    } catch (error) {
      console.error("Error fetching withdraws:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedUserId(null);
    setWithdraws([]);
  };

  return (
    <div className="withdraw-list">
      {selectedUserId ? (
        <div>
          <h2>Withdraw Status For User</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Symbol</th>
                  <th className="py-3 px-6 text-left">Amount</th>
                  <th className="py-3 px-6 text-left">Address</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {withdraws.map((withdraw) => (
                  <tr
                    key={withdraw._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">{withdraw.symbol}</td>
                    <td className="py-3 px-6 text-left">{withdraw.amount}</td>
                    <td className="py-3 px-6 text-left">{withdraw.address}</td>
                    <td className="py-3 px-6 text-left">{withdraw.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            className="mt-4 bg-gray-500 text-white py-1 px-3 rounded"
            onClick={handleBack}
          >
            Back to Clients
          </button>
        </div>
      ) : (
        <div>
          <h2>Client List</h2>
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">User ID</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {clients.map((client) => (
                <tr
                  key={client._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{client.userId}</td>
                  <td className="py-3 px-6 text-left">{client.email}</td>
                  <td className="py-3 px-6 text-left">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded"
                      onClick={() => handleViewWithdraws(client._id)}
                    >
                      View Withdraw Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WithdrawList;
