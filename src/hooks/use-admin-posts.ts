"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchAdminPosts,
  createPost,
  updatePost,
  deletePost,
  type PostRow,
  type PaginationMeta,
} from "@/app/admin/_actions/posts-actions";

export function useAdminPosts(initialPage = 1, limit = 10) {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: initialPage, limit, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();

  const load = useCallback(
    async (page: number, pub?: boolean, cat?: string) => {
      setLoading(true);
      const result = await fetchAdminPosts(page, limit, pub, cat);
      setPosts(result.data);
      setPagination(result.pagination);
      setLoading(false);
    },
    [limit]
  );

  useEffect(() => {
    load(initialPage, publishedFilter, categoryFilter);
  }, [load, initialPage, publishedFilter, categoryFilter]);

  const setPage = (page: number) => load(page, publishedFilter, categoryFilter);

  const filterByPublished = (val?: boolean) => {
    setPublishedFilter(val);
    load(1, val, categoryFilter);
  };

  const filterByCategory = (val?: string) => {
    setCategoryFilter(val);
    load(1, publishedFilter, val);
  };

  const addPost = async (data: unknown) => {
    const result = await createPost(data);
    if (result.data) {
      setPosts((prev) => [result.data!, ...prev]);
      setPagination((p) => ({ ...p, total: p.total + 1 }));
    }
    return result;
  };

  const editPost = async (slug: string, data: unknown) => {
    const result = await updatePost(slug, data);
    if (result.data) {
      setPosts((prev) => prev.map((p) => (p.slug === slug ? result.data! : p)));
    }
    return result;
  };

  const removePost = async (slug: string) => {
    const result = await deletePost(slug);
    if (!result.error) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
      setPagination((p) => ({ ...p, total: p.total - 1 }));
    }
    return result;
  };

  return {
    posts,
    pagination,
    loading,
    publishedFilter,
    categoryFilter,
    setPage,
    filterByPublished,
    filterByCategory,
    addPost,
    editPost,
    removePost,
  };
}
