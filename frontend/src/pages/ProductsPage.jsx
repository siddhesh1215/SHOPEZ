import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/axios';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books', 'Beauty', 'Toys'];

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '';
    const page = Number(searchParams.get('page')) || 1;
    const [searchInput, setSearchInput] = useState(keyword);

    useEffect(() => {
        setLoading(true);
        const params = { page, limit: 12 };
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        if (sort) params.sort = sort;
        getProducts(params)
            .then((res) => {
                setProducts(res.data.products);
                setTotalPages(res.data.pages);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [searchParams]);

    const setParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value); else next.delete(key);
        next.set('page', '1');
        setSearchParams(next);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setParam('keyword', searchInput);
    };

    return (
        <div className="products-page">
            <div className="page-header">
                <div className="container">
                    <h1>All Products</h1>
                    <p>Browse our wide selection of products</p>
                </div>
            </div>

            <div className="container products-layout">
                {/* Sidebar Filters */}
                <aside className="filters">
                    <h3 className="filter-title">Filters</h3>
                    <div className="divider"></div>
                    <div>
                        <p className="filter-label">Category</p>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn ${(cat === 'All' ? !category : category === cat) ? 'active' : ''}`}
                                onClick={() => setParam('category', cat === 'All' ? '' : cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="divider"></div>
                    <div>
                        <p className="filter-label">Sort By</p>
                        {[
                            { val: '', label: 'Newest' },
                            { val: 'price_asc', label: 'Price: Low → High' },
                            { val: 'price_desc', label: 'Price: High → Low' },
                            { val: 'rating', label: 'Top Rated' },
                        ].map((s) => (
                            <button
                                key={s.val}
                                className={`filter-btn ${sort === s.val ? 'active' : ''}`}
                                onClick={() => setParam('sort', s.val)}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="products-main">
                    <form className="search-bar" onSubmit={handleSearch}>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                        {keyword && (
                            <button type="button" className="btn btn-outline" onClick={() => { setSearchInput(''); setParam('keyword', ''); }}>Clear</button>
                        )}
                    </form>

                    {loading ? (
                        <div className="spinner-wrap"><div className="spinner"></div></div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <div style={{ fontSize: '4rem' }}>🔍</div>
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-3">
                                {products.map((p) => <ProductCard key={p._id} product={p} />)}
                            </div>
                            {totalPages > 1 && (
                                <div className="pagination">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            className={`page-btn ${page === p ? 'active' : ''}`}
                                            onClick={() => { const next = new URLSearchParams(searchParams); next.set('page', p); setSearchParams(next); }}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
