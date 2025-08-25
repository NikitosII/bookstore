import { Button, Input, Select, Space } from "antd";
import { FilterParams } from "../services/books";
import { useState } from "react";

interface FilterProps {
  onFilter: (params: FilterParams) => void;
  loading: boolean;
}

export const Filter = ({ onFilter, loading }: FilterProps) => {
  const [search, setSearch] = useState('');
  const [sortitem, setSortitem] = useState('');
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');

  const handleFilter = () => {
    const filterParams: FilterParams = {};
    
    if (search) filterParams.search = search;
    if (sortitem) filterParams.sortitem = sortitem;
    if (sortBy) filterParams.sortBy = sortBy;
    
    onFilter(filterParams);
  };

  const handleReset = () => {
    setSearch('');
    setSortitem('');
    setSortBy('asc');
    onFilter({});
  };

  return (
    <Space direction="vertical" style={{ marginBottom: 16, width: '100%' }}>
      <Input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        allowClear
      />
      
      <Select
        placeholder="Sort by field"
        value={sortitem || null}
        onChange={setSortitem}
        options={[
          { value: 'title', label: 'Title' },
          { value: 'author', label: 'Author' },
          { value: 'datetime', label: 'Date' },
        ]}
        style={{ width: '100%' }}
        allowClear
      />
      
      <Select
        placeholder="Sort order"
        value={sortBy}
        onChange={setSortBy}
        options={[
          { value: 'asc', label: 'Ascending' },
          { value: 'desc', label: 'Descending' },
        ]}
        style={{ width: '100%' }}
      />
      
      <Space>
        <Button type="primary" onClick={handleFilter} loading={loading}>
          Apply Filters
        </Button>
        <Button onClick={handleReset}>
          Reset
        </Button>
      </Space>
    </Space>
  );
};