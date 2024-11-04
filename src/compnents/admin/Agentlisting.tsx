import React, { useCallback, useMemo, useState } from "react";
import { useGetallagentQuery, useUpdateapprovalMutation } from "../../store/slice/Adminslice";
import { toast } from "react-toastify";
import { Agent } from "../../interfacetypes/type";
import debounce from "lodash.debounce";

const AgentList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const agentsPerPage = 5;

  const { data, isLoading, error } = useGetallagentQuery();
  const [updateApproval] = useUpdateapprovalMutation();

  const agents = data?.agents as Agent[] | undefined;
  
  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        setSearch(searchTerm);
        setCurrentPage(1);
      }, 300),
    []
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const filteredAgents = useMemo(() => {
    return agents?.filter((agent: Agent) =>
      agent.agentname.toLowerCase().includes(search.toLowerCase()) ||
      agent.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [agents, search]);

  const totalAgents = filteredAgents?.length || 0;
  const totalPages = Math.ceil(totalAgents / agentsPerPage);

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAgents?.slice(indexOfFirstAgent, indexOfLastAgent);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleActionClick = async (agent: Agent) => {
    if (!agent._id) {
      console.error("Invalid agent Id", agent._id);
      toast.error("Invalid agent Id");
      return;
    }

    try {
      const newStatus = !agent.is_Approved;
      const response = await updateApproval({ id: agent._id, is_Approved: newStatus }).unwrap();
      if (response.success) {
        toast.success("Approval status updated successfully");
      } else {
        toast.error("Failed to update approval status");
      }
    } catch (error) {
      console.error("Error while updating the status", error);
      toast.error("An error occurred while updating the status");
    }
  };

  return (
    <div className="w-full p-4">
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">Agent List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email"
            value={search}
            onChange={handleSearch}
            className="w-full md:w-72 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="text-center py-4">Loading...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">Error loading agents</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {currentAgents?.map((agent: Agent,) => (
                <div 
                  key={agent._id} 
                  className="border-b p-4 space-y-2 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{agent.agentname}</span>
                    <button
                      onClick={() => handleActionClick(agent)}
                      className={`px-3 py-1.5 rounded-lg text-white transition-colors ${
                        agent.is_Approved 
                          ? "bg-red-500 hover:bg-red-600" 
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {agent.is_Approved ? "Reject" : "Approve"}
                    </button>
                  </div>
                  <div className="text-sm space-y-1.5">
                    <p className="text-gray-600">Email: {agent.email}</p>
                    <p className="text-gray-600">Mobile: {agent.mobile}</p>
                    <p className="text-gray-600">Pincode: {agent.pincode}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
              >
                Prev
              </button>
              <span className="px-4 py-2 bg-white rounded-lg shadow-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentList;