import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

import { FilePlus, Pencil, Trash2, Search, ExternalLink, Tag } from "lucide-react";
import { useSnackbar } from "../../../Context/SnackbarContext";
import Button from "../../../components/buttons/Button";

// Define TypeScript interface matching your Excel structure
interface NewsArticle {
    id: number;
    state: string;
    district: string;
    geographicalLocations: string;
    theme: string;
    infoType: string;
    topics: string;
    industry: string;
    caseId: string;
    dateYear: string;
    newsTitle: string;
    newsUrl: string;
}

const NewsManagementList: React.FC = () => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Read current tab & page from URL search params
    const currentTab = searchParams.get("tab") || "news";
    const currentPage = Number(searchParams.get("page")) || 1;

    const [searchTerm, setSearchTerm] = useState<string>("");

    // Dummy data initialized directly from your Excel spreadsheet
    const [newsList, setNewsList] = useState<NewsArticle[]>([
        {
            id: 1,
            state: "Chhatisgarh",
            district: "Raigarh",
            geographicalLocations: "Dharamjaigarh, 496116",
            theme: "Environment",
            infoType: "News Article",
            topics: "Coal mine, Environment concern, Tribals' protest",
            industry: "Mining",
            caseId: "NA-En-001-A",
            dateYear: "24.04.2026",
            newsTitle: "Raigarh tribals invoke PESA to block Adani-Ambuja coal mine",
            newsUrl: "https://rootsalert.com/raigarh-tribals-invoke-pesa-to-block-adani-ambuja-coal-mine/",
        },
        {
            id: 2,
            state: "Chhatisgarh",
            district: "Raigarh",
            geographicalLocations: "Dharamjaigarh, 496116",
            theme: "Environment",
            infoType: "News Article",
            topics: "Coal mine, Environment concern, Tribals' protest",
            industry: "Mining",
            caseId: "NA-En-001-B",
            dateYear: "10.11.2025",
            newsTitle: "Community resistance and ecological risks concerns over Adani-Ambuja's Purunga underground coal mine in Chhattisgarh",
            newsUrl: "https://energy.economictimes.indiatimes.com/news/coal/raigarh-villagers-protest-against-coal-mining-project-amidst-environmental-concerns/125213881",
        },
    ]);

    const [isLoading] = useState<boolean>(false);

    // Handle navigate to Add News page
    const handleAddNewsClick = () => {
        navigate("/news/add-news", {
            state: {
                from: `/news?tab=${currentTab}&page=${currentPage}`,
                returnTab: currentTab,
                returnPage: currentPage,
            },
        });
    };

    // Handle navigate to Edit News page
    const handleEditNewsClick = (news: NewsArticle) => {
        navigate(`/news/edit/${news.id}`, {
            state: {
                news,
                from: `/news?tab=${currentTab}&page=${currentPage}`,
                returnTab: currentTab,
                returnPage: currentPage,
            },
        });
    };

    // Handle local deletion for dummy data
    const handleDeleteNews = (newsId: number) => {
        if (!window.confirm("Are you sure you want to delete this news article?")) return;

        setNewsList((prev) => prev.filter((item) => item.id !== newsId));
        showSnackbar("News deleted successfully", {
            type: "success",
            duration: 3000,
        });
    };

    // Filter news based on search input (matching caseId, title, or topics)
    const filteredNews = newsList.filter(
        (item) =>
            item?.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.newsTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.topics?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 font-sans">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {t("pages.newsManagement.title", "News Management")}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {t("pages.newsManagement.subtitle", "Manage contextual news entries, themes, and topics.")}
                    </p>
                </div>
                <Button
                    label={t("pages.newsManagement.addNews", "Add News")}
                    size="sm"
                    variant="success"
                    type="button"
                    icon={<FilePlus size={18} />}
                    onClick={handleAddNewsClick}
                />
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-md shadow mb-6 flex items-center justify-between border border-gray-100">
                <div className="relative w-full md:w-1/3">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Search size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by Case ID, title, or topics..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* News Table */}
            <div className="bg-white rounded-md shadow overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <th className="py-3 px-6">Case ID</th>
                                <th className="py-3 px-6">Theme</th>
                                <th className="py-3 px-6">Topics</th>
                                <th className="py-3 px-6">News Title</th>
                                <th className="py-3 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-gray-500">
                                        Loading news articles...
                                    </td>
                                </tr>
                            ) : filteredNews.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-gray-500">
                                        No data found.
                                    </td>
                                </tr>
                            ) : (
                                filteredNews.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Case ID */}
                                        <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                            {item.caseId}
                                        </td>

                                        {/* Theme (Badge format) */}
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                                                {item.theme}
                                            </span>
                                        </td>

                                        {/* Topics (Tag pills format) */}
                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {item.topics ? (
                                                    item.topics.split(",").map((topic, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                                                        >
                                                            <Tag size={10} className="text-gray-400" />
                                                            {topic.trim()}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 italic">No topics</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* News Title & Link */}
                                        <td className="py-4 px-6 max-w-sm">
                                            <div className="font-medium text-gray-900 line-clamp-2" title={item.newsTitle}>
                                                {item.newsTitle}
                                            </div>
                                            {item.newsUrl && (
                                                <a
                                                    href={item.newsUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline mt-1"
                                                >
                                                    <span>Source Link</span>
                                                    <ExternalLink size={12} />
                                                </a>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                                            <button
                                                title="Edit News"
                                                onClick={() => handleEditNewsClick(item)}
                                                className="text-gray-500 hover:text-indigo-600 transition-colors inline-block"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                title="Delete News"
                                                onClick={() => handleDeleteNews(item.id)}
                                                className="text-gray-500 hover:text-red-600 transition-colors inline-block"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NewsManagementList;