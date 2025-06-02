"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  User as UserIcon,
  Loader2,
  Shield,
  ShieldOff,
  ShieldAlert,
  ShieldCheck,
  Percent,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

interface UserDiscount {
  type: "percentage" | "free_shipping" | "fixed";
  value?: number; // pentru discount procentual sau fix
  active: boolean;
  description?: string;
}

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: { emailAddress: string }[];
  createdAt: string;
  publicMetadata: {
    isAdmin?: boolean;
    isModerator?: boolean;
    discount?: UserDiscount;
    discounts?: UserDiscount[];
  };
  imageUrl?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

interface UserListProps {
  initialUsers: User[];
  initialPagination?: Pagination;
}

export default function UserList({
  initialUsers,
  initialPagination,
}: UserListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [pagination, setPagination] = useState<Pagination>(
    initialPagination || {
      currentPage: 1,
      totalPages: 1,
      totalCount: initialUsers.length,
      limit: 10,
    }
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // State pentru dialog de discount
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [discountType, setDiscountType] = useState<
    "percentage" | "free_shipping" | "fixed"
  >("percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isDiscountSelectorOpen, setIsDiscountSelectorOpen] = useState(false);
  const [userDiscounts, setUserDiscounts] = useState<UserDiscount[]>([]);
  const [selectedDiscountIndex, setSelectedDiscountIndex] =
    useState<number>(-1);

  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.emailAddresses[0]?.emailAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name":
          return (a.firstName || "").localeCompare(b.firstName || "");
        default:
          return 0;
      }
    });

    setFilteredUsers(result);
  }, [users, searchTerm, sortBy]);

  // Funcția pentru încărcarea paginii
  const fetchUsers = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `/api/users?page=${page}&limit=${pagination.limit}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Eroare la încărcarea utilizatorilor"
        );
      }

      const data = await response.json();
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Eroare la încărcarea utilizatorilor:", err);
      setError(err instanceof Error ? err.message : "A apărut o eroare");
    } finally {
      setIsLoading(false);
    }
  };

  // Funcția pentru schimbarea rolului de admin
  const toggleAdminRole = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      setIsUpdating(userId);
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin: !isCurrentlyAdmin }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Eroare la actualizarea rolului");
      }

      // Actualizează utilizatorul în lista locală
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              publicMetadata: {
                ...user.publicMetadata,
                isAdmin: !isCurrentlyAdmin,
              },
            };
          }
          return user;
        })
      );
    } catch (err) {
      console.error("Eroare la actualizarea rolului:", err);
      setError(err instanceof Error ? err.message : "A apărut o eroare");
    } finally {
      setIsUpdating(null);
    }
  };

  // Funcția pentru schimbarea rolului de moderator
  const toggleModeratorRole = async (
    userId: string,
    isCurrentlyModerator: boolean,
    isAdmin: boolean
  ) => {
    // Nu permitem retragerea rolului de moderator de la admini
    if (isAdmin && isCurrentlyModerator) {
      setError("Nu poți retrage rolul de moderator unui administrator");
      return;
    }

    try {
      setIsUpdating(userId);
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isModerator: !isCurrentlyModerator }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Eroare la actualizarea rolului");
      }

      // Actualizează utilizatorul în lista locală
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              publicMetadata: {
                ...user.publicMetadata,
                isModerator: !isCurrentlyModerator,
              },
            };
          }
          return user;
        })
      );
    } catch (err) {
      console.error("Eroare la actualizarea rolului:", err);
      setError(err instanceof Error ? err.message : "A apărut o eroare");
    } finally {
      setIsUpdating(null);
    }
  };

  // Funcția pentru aplicarea discountului
  const applyDiscount = async () => {
    if (!selectedUserId) return;

    try {
      setIsUpdating(selectedUserId);

      const discountData: UserDiscount = {
        type: discountType,
        active: true,
      };

      if (discountType === "percentage") {
        discountData.value = discountValue;
      } else if (discountType === "fixed") {
        discountData.value = discountValue;
      }

      // Determinăm dacă actualizăm un discount existent sau adăugăm unul nou
      let endpoint = `/api/users/${selectedUserId}/discount`;
      let method = "PATCH";
      let body: any = { discount: discountData };

      // Dacă avem un index valabil, actualizăm un discount existent
      if (selectedDiscountIndex >= 0) {
        body.updateIndex = selectedDiscountIndex;
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Eroare la aplicarea discountului");
      }

      // Actualizează utilizatorul în lista locală
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === selectedUserId) {
            // Obținem lista de discounturi existente
            let updatedDiscounts = [...(user.publicMetadata.discounts || [])];

            // Dacă actualizăm un discount existent
            if (
              selectedDiscountIndex >= 0 &&
              updatedDiscounts.length > selectedDiscountIndex
            ) {
              updatedDiscounts[selectedDiscountIndex] = discountData;
            } else {
              // Altfel adăugăm un nou discount
              updatedDiscounts.push(discountData);
            }

            return {
              ...user,
              publicMetadata: {
                ...user.publicMetadata,
                discount: discountData, // Păstrăm pentru compatibilitate
                discounts: updatedDiscounts,
              },
            };
          }
          return user;
        })
      );

      toast({
        title:
          selectedDiscountIndex >= 0
            ? "Discount actualizat"
            : "Discount adăugat",
        description:
          selectedDiscountIndex >= 0
            ? "Discountul a fost actualizat cu succes."
            : "Discountul a fost adăugat cu succes. Utilizatorul poate cumula mai multe discounturi.",
        variant: "default",
      });

      setIsDiscountDialogOpen(false);
      setIsDiscountSelectorOpen(false);
      setSelectedDiscountIndex(-1);
    } catch (err) {
      console.error("Eroare la aplicarea discountului:", err);
      setError(err instanceof Error ? err.message : "A apărut o eroare");
    } finally {
      setIsUpdating(null);
    }
  };

  // Funcția pentru eliminarea discountului
  const removeDiscount = async (userId: string) => {
    try {
      setIsUpdating(userId);

      const response = await fetch(`/api/users/${userId}/discount`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Eroare la eliminarea discountului");
      }

      // Actualizează utilizatorul în lista locală
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === userId) {
            // Creăm o copie a metadatelor fără discount și discounts
            const updatedMetadata = { ...user.publicMetadata };
            delete updatedMetadata.discount;
            delete updatedMetadata.discounts;

            return {
              ...user,
              publicMetadata: updatedMetadata,
            };
          }
          return user;
        })
      );

      toast({
        title: "Discounturi eliminate",
        description: "Toate discounturile au fost eliminate cu succes.",
        variant: "default",
      });
    } catch (err) {
      console.error("Eroare la eliminarea discountului:", err);
      setError(err instanceof Error ? err.message : "A apărut o eroare");
    } finally {
      setIsUpdating(null);
    }
  };

  // Funcția pentru deschiderea dialogului de discount
  const openDiscountDialog = (userId: string, isNew: boolean = false) => {
    setSelectedUserId(userId);
    const user = users.find((u) => u.id === userId);

    if (!user) return;

    // Dacă se adaugă un discount nou, resetăm la valorile implicite
    if (isNew) {
      setDiscountType("percentage");
      setDiscountValue(10);
      setSelectedDiscountIndex(-1);
      setIsDiscountDialogOpen(true);
      return;
    }

    // Verificăm dacă utilizatorul are mai multe discounturi
    const discounts = user.publicMetadata?.discounts || [];
    const activeDiscounts = discounts.filter((d) => d.active);

    // Adăugăm și discountul legacy dacă există
    if (
      user.publicMetadata?.discount?.active &&
      !activeDiscounts.some(
        (d) =>
          d.type === user.publicMetadata.discount?.type &&
          d.value === user.publicMetadata.discount?.value
      )
    ) {
      activeDiscounts.push(user.publicMetadata.discount);
    }

    // Dacă utilizatorul are mai multe discounturi, afișăm selectorul
    if (activeDiscounts.length > 1) {
      setUserDiscounts(activeDiscounts);
      setIsDiscountSelectorOpen(true);
      return;
    }

    // Dacă utilizatorul are doar un discount, îl precompletăm direct
    if (activeDiscounts.length === 1) {
      const discount = activeDiscounts[0];
      setDiscountType(discount.type);
      if (discount.value) {
        setDiscountValue(discount.value);
      }
      // Găsim indexul discountului în lista originală
      const index = discounts.findIndex(
        (d) => d.type === discount.type && d.value === discount.value
      );
      setSelectedDiscountIndex(index);
    } else {
      // Resetăm la valorile implicite dacă nu găsim discounturi
      setDiscountType("percentage");
      setDiscountValue(10);
      setSelectedDiscountIndex(-1);
    }

    setIsDiscountDialogOpen(true);
  };

  // Funcția pentru a selecta un discount din listă
  const selectDiscount = (index: number) => {
    if (index >= 0 && index < userDiscounts.length) {
      const discount = userDiscounts[index];
      setDiscountType(discount.type);
      if (discount.value) {
        setDiscountValue(discount.value);
      }

      // Găsim indexul real al discountului în metadatele utilizatorului
      const user = users.find((u) => u.id === selectedUserId);
      if (user) {
        const discounts = user.publicMetadata?.discounts || [];
        const realIndex = discounts.findIndex(
          (d) => d.type === discount.type && d.value === discount.value
        );
        setSelectedDiscountIndex(realIndex);
      }

      setIsDiscountSelectorOpen(false);
      setIsDiscountDialogOpen(true);
    }
  };

  // Funcția pentru schimbarea paginii
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages || isLoading) return;
    fetchUsers(newPage);
  };

  // Funcția pentru a determina rolul utilizatorului pentru afișare
  const getUserRole = (user: User) => {
    if (user.publicMetadata?.isAdmin) {
      return {
        label: "Admin",
        icon: <Shield className="mr-1 h-3 w-3" />,
        className: "bg-primary/10 text-primary",
      };
    } else if (user.publicMetadata?.isModerator) {
      return {
        label: "Moderator",
        icon: <ShieldAlert className="mr-1 h-3 w-3" />,
        className: "bg-amber-100 text-amber-700",
      };
    } else {
      return {
        label: "Utilizator",
        icon: null,
        className: "bg-gray-100 text-gray-800",
      };
    }
  };

  // Funcția pentru a formata discountul pentru afișare
  const formatDiscount = (discount?: UserDiscount) => {
    if (!discount || !discount.active) return null;

    if (discount.type === "percentage") {
      return `${discount.value}% discount`;
    } else if (discount.type === "free_shipping") {
      return "Transport gratuit";
    } else if (discount.type === "fixed") {
      return `${discount.value} RON discount fix`;
    }

    return null;
  };

  // Funcția pentru a afișa toate discounturile unui utilizator
  const formatAllDiscounts = (user: User) => {
    const discounts = user.publicMetadata?.discounts || [];
    const activeDiscounts = discounts.filter((d) => d.active);

    if (activeDiscounts.length === 0) {
      // Verificăm și discountul legacy
      if (user.publicMetadata?.discount?.active) {
        return formatDiscount(user.publicMetadata.discount);
      }
      return null;
    }

    if (activeDiscounts.length === 1) {
      return formatDiscount(activeDiscounts[0]);
    }

    return `${activeDiscounts.length} discounturi active`;
  };

  // Funcția pentru a formata un discount pentru afișare în lista de selecție
  const getDiscountLabel = (discount: UserDiscount) => {
    if (discount.type === "percentage") {
      return `Discount procentual: ${discount.value}%`;
    } else if (discount.type === "free_shipping") {
      return "Transport gratuit";
    } else if (discount.type === "fixed") {
      return `Discount sumă fixă: ${discount.value} RON`;
    }
    return "Discount necunoscut";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Caută utilizatori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="newest">Cele mai noi</option>
          <option value="oldest">Cele mai vechi</option>
          <option value="name">Nume</option>
        </select>
      </div>

      {error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4">ID</th>
                  <th className="text-left py-4 px-4">Utilizator</th>
                  <th className="text-left py-4 px-4">Email</th>
                  <th className="text-left py-4 px-4">Data Înregistrării</th>
                  <th className="text-left py-4 px-4">Rol</th>
                  <th className="text-left py-4 px-4">Discount</th>
                  <th className="text-left py-4 px-4">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-500">
                      Nu s-au găsit utilizatori
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const userRole = getUserRole(user);
                    const userDiscount = formatAllDiscounts(user);

                    return (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-500 text-sm">
                          {user.id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              {user.imageUrl ? (
                                <img
                                  src={user.imageUrl}
                                  alt={user.firstName || ""}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <UserIcon className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                            <span>
                              {user.firstName || ""} {user.lastName || ""}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {user.emailAddresses[0]?.emailAddress || ""}
                        </td>
                        <td className="py-4 px-4">
                          {new Date(user.createdAt).toLocaleDateString("ro-RO")}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userRole.className}`}
                            >
                              {userRole.icon}
                              {userRole.label}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {userDiscount ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Percent className="h-3 w-3 mr-1" />
                              {userDiscount}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                {isUpdating === user.id && (
                                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                Vizualizează detalii
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {/* Buton pentru rol de admin */}
                              <DropdownMenuItem
                                onClick={() =>
                                  toggleAdminRole(
                                    user.id,
                                    !!user.publicMetadata?.isAdmin
                                  )
                                }
                                disabled={isUpdating === user.id}
                              >
                                {user.publicMetadata?.isAdmin ? (
                                  <>
                                    <ShieldOff className="mr-2 h-4 w-4" />
                                    Elimină rolul de admin
                                  </>
                                ) : (
                                  <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Setează ca admin
                                  </>
                                )}
                                {isUpdating === user.id && (
                                  <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                                )}
                              </DropdownMenuItem>

                              {/* Buton pentru rol de moderator (nu apare dacă utilizatorul e admin) */}
                              {!user.publicMetadata?.isAdmin && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    toggleModeratorRole(
                                      user.id,
                                      !!user.publicMetadata?.isModerator,
                                      !!user.publicMetadata?.isAdmin
                                    )
                                  }
                                  disabled={isUpdating === user.id}
                                >
                                  {user.publicMetadata?.isModerator ? (
                                    <>
                                      <ShieldOff className="mr-2 h-4 w-4" />
                                      Elimină rolul de moderator
                                    </>
                                  ) : (
                                    <>
                                      <ShieldAlert className="mr-2 h-4 w-4" />
                                      Setează ca moderator
                                    </>
                                  )}
                                  {isUpdating === user.id && (
                                    <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                                  )}
                                </DropdownMenuItem>
                              )}

                              {/* Secțiune pentru discount */}
                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() => openDiscountDialog(user.id)}
                                disabled={isUpdating === user.id}
                              >
                                <Percent className="mr-2 h-4 w-4" />
                                {user.publicMetadata?.discount?.active ||
                                (user.publicMetadata?.discounts &&
                                  user.publicMetadata.discounts.length > 0)
                                  ? "Modifică discount activ"
                                  : "Adaugă discount automat"}
                              </DropdownMenuItem>

                              {/* Buton pentru adăugare discount nou */}
                              {(user.publicMetadata?.discount?.active ||
                                (user.publicMetadata?.discounts &&
                                  user.publicMetadata.discounts.length >
                                    0)) && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    openDiscountDialog(user.id, true)
                                  }
                                  disabled={isUpdating === user.id}
                                >
                                  <Percent className="mr-2 h-4 w-4" />
                                  Adaugă un nou discount
                                </DropdownMenuItem>
                              )}

                              {(user.publicMetadata?.discount?.active ||
                                (user.publicMetadata?.discounts &&
                                  user.publicMetadata.discounts.length >
                                    0)) && (
                                <DropdownMenuItem
                                  onClick={() => removeDiscount(user.id)}
                                  disabled={isUpdating === user.id}
                                  className="text-red-600"
                                >
                                  <Percent className="mr-2 h-4 w-4" />
                                  Elimină toate discounturile
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />

                              <DropdownMenuItem className="text-red-600">
                                Dezactivează cont
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 px-4">
                <div className="text-sm text-gray-500">
                  Afișare {(pagination.currentPage - 1) * pagination.limit + 1}{" "}
                  -{" "}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalCount
                  )}{" "}
                  din {pagination.totalCount} utilizatori
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      // Calculăm paginile care trebuie afișate
                      let pageToShow;
                      if (pagination.totalPages <= 5) {
                        pageToShow = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageToShow = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 2
                      ) {
                        pageToShow = pagination.totalPages - 4 + i;
                      } else {
                        pageToShow = pagination.currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageToShow}
                          variant={
                            pagination.currentPage === pageToShow
                              ? "default"
                              : "outline"
                          }
                          onClick={() => changePage(pageToShow)}
                          disabled={isLoading}
                        >
                          {pageToShow}
                        </Button>
                      );
                    }
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={
                      pagination.currentPage === pagination.totalPages ||
                      isLoading
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialog pentru selectarea discountului de modificat */}
      <Dialog
        open={isDiscountSelectorOpen}
        onOpenChange={setIsDiscountSelectorOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Selectați discountul de modificat</DialogTitle>
            <DialogDescription>
              Acest utilizator are mai multe discounturi active. Selectați
              discountul pe care doriți să îl modificați.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2">
              {userDiscounts.map((discount, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => selectDiscount(index)}
                >
                  <span>{getDiscountLabel(discount)}</span>
                  <Button variant="ghost" size="sm">
                    Selectează
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDiscountSelectorOpen(false)}
            >
              Anulează
            </Button>
            <Button
              onClick={() => {
                setIsDiscountSelectorOpen(false);
                setDiscountType("percentage");
                setDiscountValue(10);
                setSelectedDiscountIndex(-1);
                setIsDiscountDialogOpen(true);
              }}
            >
              Adaugă nou discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pentru configurarea discountului */}
      <Dialog
        open={isDiscountDialogOpen}
        onOpenChange={setIsDiscountDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDiscountIndex >= 0
                ? "Modificare Discount"
                : "Adaugă Discount Nou"}
            </DialogTitle>
            <DialogDescription>
              Configurați discountul automat pentru acest utilizator. Discountul
              va fi aplicat automat la checkout. Un utilizator poate beneficia
              de mai multe discounturi simultan.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <RadioGroup
              value={discountType}
              onValueChange={(val) =>
                setDiscountType(val as "percentage" | "free_shipping" | "fixed")
              }
              className="grid grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Discount procentual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Sumă fixă</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free_shipping" id="free_shipping" />
                <Label htmlFor="free_shipping">Transport gratuit</Label>
              </div>
            </RadioGroup>

            {discountType === "percentage" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount" className="text-right col-span-1">
                  Procent:
                </Label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="discount"
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-20"
                    min={1}
                    max={100}
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
            )}

            {discountType === "fixed" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount" className="text-right col-span-1">
                  Sumă:
                </Label>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="discount"
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-20"
                    min={1}
                  />
                  <span className="ml-2">RON</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDiscountDialogOpen(false)}
            >
              Anulează
            </Button>
            <Button
              onClick={applyDiscount}
              disabled={isUpdating === selectedUserId}
            >
              {isUpdating === selectedUserId ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Percent className="h-4 w-4 mr-2" />
              )}
              {selectedDiscountIndex >= 0
                ? "Actualizează Discount"
                : "Aplică Discount"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
