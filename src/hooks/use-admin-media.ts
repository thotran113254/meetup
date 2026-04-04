"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchAdminMedia,
  fetchMediaFolders,
  fetchRootMediaCount,
  createMedia,
  deleteMedia,
  type MediaRow,
  type PaginationMeta,
} from "@/app/admin/_actions/media-actions";

export type FolderInfo = { name: string; count: number };

export function useAdminMedia(initialPage = 1, limit = 40) {
  const [items, setItems] = useState<MediaRow[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: initialPage, limit, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [folderFilter, setFolderFilter] = useState<string | undefined>();
  const [folders, setFolders] = useState<FolderInfo[]>([]);
  const [rootCount, setRootCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const load = useCallback(
    async (page: number, type?: string, folder?: string) => {
      setLoading(true);
      const result = await fetchAdminMedia(page, limit, type, folder);
      setItems(result.data);
      setPagination(result.pagination);
      setLoading(false);
    },
    [limit]
  );

  const loadFolders = useCallback(async () => {
    const [folderData, root, allCount] = await Promise.all([
      fetchMediaFolders(),
      fetchRootMediaCount(),
      fetchAdminMedia(1, 1).then((r) => r.pagination.total),
    ]);
    setFolders(folderData);
    setRootCount(root);
    setTotalCount(allCount);
  }, []);

  useEffect(() => {
    load(initialPage, typeFilter, folderFilter);
    loadFolders();
  }, [load, loadFolders, initialPage, typeFilter, folderFilter]);

  const setPage = (page: number) => load(page, typeFilter, folderFilter);
  const refresh = () => { load(pagination.page, typeFilter, folderFilter); loadFolders(); };

  const filterByType = (type?: string) => { setTypeFilter(type); load(1, type, folderFilter); };
  const filterByFolder = (folder?: string) => { setFolderFilter(folder); load(1, typeFilter, folder); };

  const addItem = (item: MediaRow) => {
    setItems((prev) => [item, ...prev]);
    setPagination((p) => ({ ...p, total: p.total + 1 }));
    loadFolders(); // refresh folder counts
  };

  const removeMedia = async (id: string) => {
    const result = await deleteMedia(id);
    if (!result.error) {
      setItems((prev) => prev.filter((m) => m.id !== id));
      setPagination((p) => ({ ...p, total: p.total - 1 }));
      loadFolders();
    }
    return result;
  };

  return {
    items, pagination, loading,
    typeFilter, folderFilter, folders, rootCount, totalCount,
    setPage, refresh,
    filterByType, filterByFolder,
    addItem, removeMedia,
  };
}
