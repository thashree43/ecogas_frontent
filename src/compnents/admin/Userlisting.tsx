import React, { useState, useMemo, useCallback } from "react";
import { useGetusersQuery, useUpdatestatusMutation } from "../../store/slice/Adminslice";
import { toast } from "react-toastify";
import { User } from "../../interfacetypes/type";
import debounce from "lodash.debounce";

const UserList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 5;

  const { data: users, isLoading, error } = useGetusersQuery();
  const [updatestatus] = useUpdatestatusMutation();

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

  const toggleBlockStatus = async (userId: string, currentStatus: boolean) => {
    if (!userId) {
      console.error("Invalid user ID:", userId);
      toast.error("Invalid user ID. Please try again.");
      return;
    }

    try {
      const newStatus = !currentStatus;
      const result = await updatestatus({ id: userId, is_blocked: newStatus }).unwrap();
      if (result.success) {
        toast.success("User status updated successfully");
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error("Error while updating status:", error);
      toast.error("An error occurred while updating the status. Please try again.");
    }
  };

  const filteredUsers = useMemo(() => {
    return users?.filter((user: User) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalUsers = filteredUsers?.length || 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">User List</h2>
      
      <input
        type="text"
        placeholder="Search by name, email"
        onChange={handleSearch}
        className="w-full md:w-72 p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isLoading ? (
        <p className="text-center py-4">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-4">Error loading users</p>
      ) : (
        <>
          <div className="w-full">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b text-left">
                  <th className="p-2 md:p-3 w-12 md:w-16">No</th>
                  <th className="p-2 md:p-3">
                    <span className="md:hidden">User Info</span>
                    <span className="hidden md:inline">Name</span>
                  </th>
                  <th className="hidden md:table-cell p-3">Email</th>
                  <th className="p-2 md:p-3 text-right md:text-center w-20 md:w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentUsers?.map((user: User, index: number) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-2 md:p-3 align-top md:align-middle text-sm">
                      {indexOfFirstUser + index + 1}
                    </td>
                    <td className="p-2 md:p-3">
                      <div className="text-sm font-medium">{user.username}</div>
                      <div className="text-xs text-gray-500 mt-0.5 md:hidden">{user.email}</div>
                    </td>
                    <td className="hidden md:table-cell p-3 text-sm">{user.email}</td>
                    <td className="p-2 md:p-3 text-right md:text-center align-top md:align-middle">
                      <button
                        onClick={() => toggleBlockStatus(user._id, user.is_blocked)}
                        className={`inline-block px-3 py-1 text-xs rounded text-white ${
                          user.is_blocked 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {user.is_blocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex flex-wrap gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 text-sm rounded ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;