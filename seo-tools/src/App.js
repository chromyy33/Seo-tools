import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Chip,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack,
  Popover,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from "@mui/material";
import {
  LayoutDashboard,
  FileText,
  Star,
  Sun,
  Moon,
  BarChart3,
  Search as SearchIcon,
  Link2,
  Globe,
  LineChart,
  Settings,
  ExternalLink,
  ArrowUpDown,
  Sparkles,
  Code2,
  Gauge,
  Share2,
  Rocket,
  Bot,
  Clock,
  Calendar,
  User,
  BookOpen,
  ArrowRight,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { blogPosts as importedBlogPosts } from "./data/blogPosts";
import {
  seoTools as importedSeoTools,
  categoryColors,
  pricingTierColors,
} from "./data/seoTools";

// Optimize table row component with better memoization
const ToolTableRow = React.memo(
  ({
    tool,
    index,
    mode,
    expandedDescriptions,
    toggleDescription,
    getCategoryColor,
    getPricingTierColor,
  }) => {
    const isExpanded = expandedDescriptions[index];
    const categoryColors = tool.category
      .slice(0, 2)
      .map((cat) => getCategoryColor(cat));
    const pricingTierColor = getPricingTierColor(tool.pricingTier);

    return (
      <TableRow
        sx={{
          "&:hover": {
            bgcolor: mode === "dark" ? "#1a1a1a" : "#f8f8f8",
          },
        }}
      >
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {tool.name}
            </Typography>
            <IconButton
              size="small"
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <ExternalLink size={16} />
            </IconButton>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            sx={{ gap: 0.5 }}
          >
            {tool.category.slice(0, 2).map((cat, idx) => (
              <Chip
                key={idx}
                label={cat}
                size="small"
                sx={{
                  bgcolor: categoryColors[idx].bg,
                  color: categoryColors[idx].color,
                  "&:hover": {
                    bgcolor: categoryColors[idx].bg,
                  },
                }}
              />
            ))}
          </Stack>
        </TableCell>
        <TableCell>
          <Rating
            value={tool.ratingValue}
            precision={0.1}
            readOnly
            size="small"
          />
        </TableCell>
        <TableCell>
          {tool.price === "Free" ? (
            <Chip
              label="Free"
              size="small"
              sx={{
                bgcolor: "#e8f5e9",
                color: "#2e7d32",
                "&:hover": {
                  bgcolor: "#e8f5e9",
                },
              }}
            />
          ) : (
            <Stack direction="column" spacing={0.5}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {tool.price}
              </Typography>
              {tool.hasPaidPlan && (
                <Typography variant="caption" color="text.secondary">
                  Up to {tool.paidPlanPrice}
                </Typography>
              )}
            </Stack>
          )}
        </TableCell>
        <TableCell>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: 300,
                display: "-webkit-box",
                WebkitLineClamp: isExpanded ? "none" : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.5,
              }}
            >
              {tool.description}
            </Typography>
            <Button
              size="small"
              onClick={() => toggleDescription(index)}
              sx={{
                textTransform: "none",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "primary.main",
                },
              }}
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo
    return (
      prevProps.tool === nextProps.tool &&
      prevProps.index === nextProps.index &&
      prevProps.mode === nextProps.mode &&
      prevProps.expandedDescriptions[prevProps.index] ===
        nextProps.expandedDescriptions[nextProps.index]
    );
  }
);

// Optimize table header component
const TableHeader = React.memo(({ handleSort }) => (
  <TableHead>
    <TableRow>
      {["Name", "Category", "Rating", "Price", "Description"].map((header) => (
        <TableCell
          key={header}
          onClick={() => handleSort(header.toLowerCase())}
          sx={{ cursor: "pointer" }}
        >
          {header}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
));

// Optimize table container component
const TableContainerWrapper = React.memo(({ mode, children }) => (
  <TableContainer
    component={Paper}
    elevation={0}
    sx={{
      bgcolor: "transparent",
      overflowX: "auto",
      "&::-webkit-scrollbar": {
        height: "8px",
      },
      "&::-webkit-scrollbar-track": {
        background: mode === "dark" ? "#333" : "#f1f1f1",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: mode === "dark" ? "#666" : "#888",
        borderRadius: "4px",
        "&:hover": {
          background: mode === "dark" ? "#888" : "#999",
        },
      },
    }}
  >
    {children}
  </TableContainer>
));

// Optimize table component
const ToolsTable = React.memo(
  ({
    sortedTools,
    mode,
    expandedDescriptions,
    toggleDescription,
    getCategoryColor,
    getPricingTierColor,
    handleSort,
  }) => (
    <TableContainerWrapper mode={mode}>
      <Table>
        <TableHeader handleSort={handleSort} />
        <TableBody>
          {sortedTools.map((tool, index) => (
            <ToolTableRow
              key={tool.name}
              tool={tool}
              index={index}
              mode={mode}
              expandedDescriptions={expandedDescriptions}
              toggleDescription={toggleDescription}
              getCategoryColor={getCategoryColor}
              getPricingTierColor={getPricingTierColor}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainerWrapper>
  )
);

// Memoized blog card component
const BlogCard = React.memo(({ post, mode, getCategoryColor, navigate }) => (
  <Card
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow:
          mode === "dark"
            ? "0 4px 12px rgba(0,0,0,0.3)"
            : "0 4px 12px rgba(0,0,0,0.1)",
      },
    }}
    onClick={() => navigate(`/blog/${post.id}`)}
  >
    <Box
      sx={{
        position: "relative",
        paddingTop: "56.25%", // 16:9 aspect ratio
        overflow: "hidden",
      }}
    >
      <img
        src={post.image}
        alt={post.title}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>
    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip
            label={post.category}
            size="small"
            sx={{
              bgcolor: getCategoryColor(post.category).bg,
              color: getCategoryColor(post.category).color,
              fontWeight: 500,
            }}
          />
          {post.tags.slice(0, 2).map((tag, idx) => (
            <Chip
              key={idx}
              label={tag}
              size="small"
              variant="outlined"
              sx={{
                borderColor: mode === "dark" ? "#666" : "#e0e0e0",
                color: "text.secondary",
              }}
            />
          ))}
        </Stack>
      </Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontSize: "1.1rem",
          fontWeight: 600,
          lineHeight: 1.3,
          mb: 1,
        }}
      >
        {post.title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 2,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {post.excerpt}
      </Typography>
    </CardContent>
    <CardActions sx={{ px: 2, pb: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <User size={14} />
          <Typography variant="caption" color="text.secondary">
            {post.author}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Clock size={14} />
          <Typography variant="caption" color="text.secondary">
            {post.readTime}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ ml: "auto" }}
        >
          <Button
            endIcon={<ArrowRight size={16} />}
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "transparent",
                color: "primary.main",
              },
            }}
          >
            Read More
          </Button>
        </Stack>
      </Stack>
    </CardActions>
  </Card>
));

// Memoized blog grid component
const BlogGrid = React.memo(
  ({ blogPosts, mode, getCategoryColor, navigate }) => (
    <Grid container spacing={3}>
      {blogPosts.map((post, index) => (
        <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
          <BlogCard
            post={post}
            mode={mode}
            getCategoryColor={getCategoryColor}
            navigate={navigate}
          />
        </Grid>
      ))}
    </Grid>
  )
);

function App() {
  const [mode, setMode] = useState("light");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [toolsData, setToolsData] = useState([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isBlogPost = location.pathname.startsWith("/blog/");
  const blogPostId = location.pathname.split("/")[2];
  const isBlogPage = location.pathname === "/" || location.pathname === "/blog";
  const isToolsPage = location.pathname === "/tools";

  // Use imported blogPosts or fallback to empty array
  const blogPosts = importedBlogPosts || [];

  // Remove unused variables
  const seoTools = importedSeoTools;

  // Pre-process data once when component mounts
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Pre-process the data once with all necessary fields
        const processedTools = importedSeoTools.map((tool) => ({
          ...tool,
          searchText: `${tool.name} ${tool.category.join(" ")} ${
            tool.pricingTier
          }`.toLowerCase(),
          priceValue:
            tool.price === "Free"
              ? 0
              : parseFloat(tool.price.replace(/[^0-9.]/g, "")) || 0,
          categoryString: tool.category.join(" "),
          ratingValue: parseFloat(tool.rating),
        }));
        setToolsData(processedTools);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Optimize search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Optimize filtering and sorting with useMemo
  const filteredAndSortedTools = useMemo(() => {
    let filtered = toolsData;

    // Apply search filter if there's a search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((tool) => tool.searchText.includes(query));
    }

    // Apply sorting if there's a sort configuration
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        switch (sortConfig.key) {
          case "price":
            aValue = a.priceValue;
            bValue = b.priceValue;
            break;
          case "rating":
            aValue = a.ratingValue;
            bValue = b.ratingValue;
            break;
          case "category":
            aValue = a.categoryString;
            bValue = b.categoryString;
            break;
          default:
            break;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [toolsData, debouncedSearchQuery, sortConfig.key, sortConfig.direction]);

  // Optimize handlers with useCallback
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const toggleDescription = useCallback((index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const handleCategoryClick = useCallback((event, categories) => {
    setSelectedCategories(categories);
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedCategories(null);
  }, []);

  const open = Boolean(anchorEl);

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        700: 700,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    palette: {
      mode,
      primary: {
        main: "#2563eb",
        light: "#60a5fa",
        dark: "#1d4ed8",
      },
      secondary: {
        main: "#7c3aed",
        light: "#a78bfa",
        dark: "#5b21b6",
      },
      background: {
        default: mode === "dark" ? "#0f172a" : "#f8fafc",
        paper: mode === "dark" ? "#1e293b" : "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Figtree", "Inter", sans-serif',
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
        "@media (max-width:600px)": {
          fontSize: "2.25rem",
        },
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "1.875rem",
        },
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "1.625rem",
        },
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "1.375rem",
        },
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "1.175rem",
        },
      },
      h6: {
        fontSize: "1.1rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "1.05rem",
        },
      },
      body1: {
        fontSize: "1.125rem",
        lineHeight: 1.7,
        "@media (max-width:600px)": {
          fontSize: "1.05rem",
        },
      },
      body2: {
        fontSize: "1rem",
        lineHeight: 1.6,
        "@media (max-width:600px)": {
          fontSize: "0.95rem",
        },
      },
      subtitle1: {
        fontSize: "1.125rem",
        fontWeight: 500,
        "@media (max-width:600px)": {
          fontSize: "1.05rem",
        },
      },
      subtitle2: {
        fontSize: "1rem",
        fontWeight: 500,
        "@media (max-width:600px)": {
          fontSize: "0.95rem",
        },
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
        fontSize: "1rem",
        "@media (max-width:600px)": {
          fontSize: "0.95rem",
        },
      },
      caption: {
        fontSize: "0.875rem",
        "@media (max-width:600px)": {
          fontSize: "0.85rem",
        },
      },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === "dark" ? "#333" : "#f0f0f0"}`,
            padding: "16px",
          },
          head: {
            backgroundColor: "transparent",
            fontWeight: 600,
            color: mode === "dark" ? "#fff" : "#333",
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: mode === "dark" ? "#1a1a1a" : "#f8f8f8",
              boxShadow:
                mode === "dark"
                  ? "0 2px 8px rgba(0,0,0,0.2)"
                  : "0 2px 8px rgba(0,0,0,0.05)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            height: "24px",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow:
              mode === "dark"
                ? "0 1px 3px rgba(0,0,0,0.2)"
                : "0 1px 3px rgba(0,0,0,0.1)",
            "& .MuiChip-label": {
              fontSize: "0.75rem",
              padding: "0 8px",
            },
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 2px 5px rgba(0,0,0,0.3)"
                  : "0 2px 5px rgba(0,0,0,0.15)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.2s ease-in-out",
            boxShadow:
              mode === "dark"
                ? "0 2px 8px rgba(0,0,0,0.2)"
                : "0 2px 8px rgba(0,0,0,0.05)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                mode === "dark"
                  ? "0 8px 24px rgba(0,0,0,0.3)"
                  : "0 8px 24px rgba(0,0,0,0.1)",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "dark"
                ? "0 2px 8px rgba(0,0,0,0.2)"
                : "0 2px 8px rgba(0,0,0,0.05)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              boxShadow:
                mode === "dark"
                  ? "0 1px 3px rgba(0,0,0,0.2)"
                  : "0 1px 3px rgba(0,0,0,0.05)",
              "&:hover": {
                boxShadow:
                  mode === "dark"
                    ? "0 2px 5px rgba(0,0,0,0.3)"
                    : "0 2px 5px rgba(0,0,0,0.1)",
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            boxShadow:
              mode === "dark"
                ? "0 4px 20px rgba(0,0,0,0.3)"
                : "0 4px 20px rgba(0,0,0,0.1)",
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            boxShadow:
              mode === "dark"
                ? "0 4px 20px rgba(0,0,0,0.3)"
                : "0 4px 20px rgba(0,0,0,0.1)",
          },
        },
      },
    },
  });

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Memoize the category color function
  const getCategoryColor = useCallback((category) => {
    return categoryColors[category] || { bg: "#f5f5f5", color: "#616161" };
  }, []);

  // Memoize the pricing tier color function
  const getPricingTierColor = useCallback((tier) => {
    return pricingTierColors[tier] || { bg: "#f5f5f5", color: "#616161" };
  }, []);

  const BlogPost = ({ post }) => {
    if (!post) return null;

    // Extract only main headings (h2) for table of contents
    const headings =
      post.content.match(/<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g) || [];
    const toc = headings.map((heading) => {
      const id = heading.match(/id="([^"]*)"/)[1];
      const text = heading.replace(/<[^>]*>/g, "");
      return { text, id };
    });

    // Share functionality
    const handleShare = (platform) => {
      const currentUrl = window.location.href;
      const text = encodeURIComponent(`Check out this article: ${post.title}`);
      const url = encodeURIComponent(currentUrl);

      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        email: `mailto:?subject=${encodeURIComponent(
          post.title
        )}&body=${text}%0A%0A${url}`,
      };

      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    };

    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Back Button at Top */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate("/")}
            variant="text"
            sx={{
              textTransform: "none",
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "transparent",
              },
            }}
          >
            Back to Blog
          </Button>
        </Box>

        {/* Hero Section */}
        <Box sx={{ mb: { xs: 3, md: 4 }, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              lineHeight: 1.2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            {post.title}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 3,
              maxWidth: "800px",
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            }}
          >
            {post.excerpt}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}
              >
                {post.author[0]}
              </Avatar>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                {post.author}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              divider={
                <Box
                  component="span"
                  sx={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    bgcolor: "text.disabled",
                  }}
                />
              }
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Calendar size={16} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  {post.date}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <BookOpen size={16} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  {post.readTime}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 1 }}
            justifyContent="center"
            sx={{ mb: 3, flexWrap: "wrap", gap: { xs: 0.5, sm: 1 } }}
          >
            <Chip
              label={post.category}
              size="medium"
              sx={{
                bgcolor: getCategoryColor(post.category).bg,
                color: getCategoryColor(post.category).color,
                fontWeight: 600,
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            />
            {post.tags.map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                size="medium"
                variant="outlined"
                sx={{
                  borderColor: mode === "dark" ? "#666" : "#e0e0e0",
                  color: "text.secondary",
                  px: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Table of Contents as Navigation Tabs */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Tabs
            value={0}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor:
                mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
                height: 2,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                minWidth: "auto",
                px: 2,
                fontSize: { xs: "0.85rem", sm: "0.9rem" },
                "&.Mui-selected": {
                  color: "primary.main",
                  fontWeight: 600,
                },
              },
            }}
          >
            {toc.map((item, index) => (
              <Tab
                key={index}
                label={`${index + 1}. ${item.text}`}
                onClick={() =>
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />
            ))}
          </Tabs>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          {/* Main content */}
          <Grid item xs={12} md={8} sx={{ order: { xs: 1, md: 1 } }}>
            <Box
              dangerouslySetInnerHTML={{ __html: post.content }}
              sx={{
                "& h2": {
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  fontWeight: 800,
                  mb: 2,
                  mt: 4,
                  scrollMarginTop: "100px",
                  color: mode === "dark" ? "#fff" : "#1a1a1a",
                },
                "& h2:first-of-type": {
                  mt: 0,
                },
                "& h3": {
                  fontSize: { xs: "1.25rem", sm: "1.35rem", md: "1.5rem" },
                  fontWeight: 700,
                  mb: 2,
                  mt: 3,
                  color: mode === "dark" ? "#e0e0e0" : "#2a2a2a",
                  scrollMarginTop: "100px",
                },
                "& h4": {
                  fontSize: { xs: "1.1rem", sm: "1.15rem", md: "1.25rem" },
                  fontWeight: 600,
                  mb: 1.5,
                  color: mode === "dark" ? "#d0d0d0" : "#3a3a3a",
                },
                "& p": {
                  mb: 2,
                  lineHeight: 1.7,
                  fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem" },
                },
                "& .lead": {
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" },
                  color: "text.secondary",
                  mb: 3,
                },
                "& ul, & ol": {
                  pl: { xs: 2, sm: 3 },
                  mb: 3,
                },
                "& li": {
                  mb: 1,
                  lineHeight: 1.6,
                  fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem" },
                },
                "& .highlight-box": {
                  bgcolor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 2,
                  mb: 3,
                  border: 1,
                  borderColor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                },
                "& .steps-box": {
                  bgcolor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 2,
                  mb: 3,
                  "& ol": {
                    counterReset: "steps",
                    listStyle: "none",
                    pl: 0,
                    "& li": {
                      counterIncrement: "steps",
                      position: "relative",
                      pl: { xs: 3, sm: 4 },
                      "&::before": {
                        content: "counter(steps)",
                        position: "absolute",
                        left: 0,
                        width: "20px",
                        height: "20px",
                        bgcolor: "primary.main",
                        color: "#fff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      },
                    },
                  },
                },
              }}
            />

            {/* FAQ Section */}
            {post.faqs && post.faqs.length > 0 && (
              <Box sx={{ mt: { xs: 4, md: 6 } }}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 3,
                    fontWeight: 800,
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  }}
                >
                  Frequently Asked Questions
                </Typography>
                <Box sx={{ maxWidth: "800px" }}>
                  {post.faqs.map((faq, index) => (
                    <Accordion
                      key={index}
                      sx={{
                        mb: 1.5,
                        bgcolor:
                          mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                        boxShadow: "none",
                        "&:before": { display: "none" },
                        "&.Mui-expanded": {
                          margin: "0 0 12px 0",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ChevronDown size={20} />}
                        sx={{
                          "& .MuiAccordionSummary-content": {
                            margin: "10px 0",
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "0.95rem", sm: "1rem" },
                          }}
                        >
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                        <Typography
                          sx={{
                            lineHeight: 1.6,
                            fontSize: { xs: "0.95rem", sm: "1rem" },
                          }}
                        >
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Box>
            )}
          </Grid>

          {/* Sidebar content */}
          <Grid item xs={12} md={4} sx={{ order: { xs: 2, md: 2 } }}>
            <Box
              sx={{
                position: { xs: "static", md: "sticky" },
                top: 24,
                pl: { md: 4 },
              }}
            >
              {/* Author Bio */}
              <Card
                sx={{
                  mb: 3,
                  p: { xs: 2, sm: 2.5 },
                  bgcolor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                  boxShadow: "none",
                  border: 1,
                  borderColor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 48, sm: 56 },
                      height: { xs: 48, sm: 56 },
                      bgcolor: "primary.main",
                    }}
                  >
                    {post.author[0]}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                      }}
                    >
                      {post.author}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
                    >
                      SEO Expert & Content Strategist
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    fontSize: { xs: "0.9rem", sm: "0.95rem" },
                  }}
                >
                  {post.author} is an experienced SEO professional with over 5
                  years of expertise in digital marketing and content strategy.
                </Typography>
              </Card>

              {/* Share Buttons */}
              <Card
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  bgcolor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                  boxShadow: "none",
                  border: 1,
                  borderColor:
                    mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    fontSize: { xs: "0.95rem", sm: "1rem" },
                  }}
                >
                  Share this article
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    onClick={() => handleShare("facebook")}
                    sx={{
                      color: "#1877f2",
                      "&:hover": {
                        bgcolor: "rgba(24, 119, 242, 0.1)",
                      },
                    }}
                  >
                    <Facebook size={20} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleShare("twitter")}
                    sx={{
                      color: "#1da1f2",
                      "&:hover": {
                        bgcolor: "rgba(29, 161, 242, 0.1)",
                      },
                    }}
                  >
                    <Twitter size={20} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleShare("linkedin")}
                    sx={{
                      color: "#0077b5",
                      "&:hover": {
                        bgcolor: "rgba(0, 119, 181, 0.1)",
                      },
                    }}
                  >
                    <Linkedin size={20} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleShare("email")}
                    sx={{
                      color: "#ea4335",
                      "&:hover": {
                        bgcolor: "rgba(234, 67, 53, 0.1)",
                      },
                    }}
                  >
                    <Mail size={20} />
                  </IconButton>
                </Stack>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{
            borderBottom: "1px solid",
            borderColor: mode === "dark" ? "#333" : "#e9ecef",
            bgcolor: mode === "dark" ? "#1e1e1e" : "#fff",
          }}
        >
          <Toolbar>
            <Box
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <LayoutDashboard size={24} />
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: mode === "dark" ? "#fff" : "#333",
                  display: { xs: "none", sm: "block" }, // Hide only text on mobile
                }}
              >
                SEO Tools Hub
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                alignItems: "center",
              }}
            >
              <Button
                startIcon={<FileText size={18} />}
                onClick={() => navigate("/")}
                sx={{
                  textTransform: "none",
                  color: isBlogPage ? "primary.main" : "text.primary",
                  fontWeight: isBlogPage ? 600 : 400,
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "transparent",
                  },
                  px: { xs: 1, sm: 2 },
                }}
              >
                Blog
              </Button>
              <Button
                startIcon={<Star size={18} />}
                onClick={() => navigate("/tools")}
                sx={{
                  textTransform: "none",
                  color: isToolsPage ? "primary.main" : "text.primary",
                  fontWeight: isToolsPage ? 600 : 400,
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "transparent",
                  },
                  px: { xs: 1, sm: 2 },
                }}
              >
                SEO Tools
              </Button>
              <IconButton onClick={toggleColorMode} color="inherit">
                {mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 3 }}>
          {isBlogPost ? (
            <BlogPost post={blogPosts.find((post) => post.id === blogPostId)} />
          ) : isBlogPage ? (
            <>
              <Typography
                variant="h1"
                sx={{
                  fontSize: {
                    xs: "2rem", // 32px for mobile
                    sm: "2.5rem", // 40px for tablets
                    md: "3rem", // 48px max size
                  },
                  fontWeight: 800,
                  mb: { xs: 2, sm: 3, md: 4 },
                  textAlign: "center",
                  background: "linear-gradient(45deg, #2196f3, #1976d2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: { xs: 1.2, sm: 1.3 },
                  px: { xs: 2, sm: 0 },
                }}
              >
                Best Free & Premium SEO Tools Collection 2024
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  mb: { xs: 4, sm: 5, md: 6 },
                  maxWidth: "800px",
                  mx: "auto",
                  fontSize: {
                    xs: "1.1rem",
                    sm: "1.25rem",
                    md: "1.5rem",
                  },
                  px: { xs: 2, sm: 3, md: 0 },
                  lineHeight: { xs: 1.4, sm: 1.5 },
                }}
              >
                Discover and compare the most comprehensive collection of SEO
                tools to boost your website's performance
              </Typography>
              <BlogGrid
                blogPosts={blogPosts}
                mode={mode}
                getCategoryColor={getCategoryColor}
                navigate={navigate}
              />
            </>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search tools by name, category, or pricing tier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon size={20} />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: "background.paper",
                      "&:hover": {
                        bgcolor: mode === "dark" ? "#1a1a1a" : "#f8f8f8",
                      },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: mode === "dark" ? "#333" : "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: mode === "dark" ? "#444" : "#bdbdbd",
                      },
                    },
                  }}
                />
              </Box>

              {isLoading ? (
                <>
                  {/* Desktop Table Skeleton */}
                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        bgcolor: "transparent",
                        overflowX: "auto",
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            {[
                              "Name",
                              "Category",
                              "Rating",
                              "Price",
                              "Description",
                            ].map((header) => (
                              <TableCell key={header}>
                                <Skeleton variant="text" width={100} />
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[...Array(5)].map((_, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Skeleton variant="text" width={150} />
                              </TableCell>
                              <TableCell>
                                <Skeleton variant="text" width={100} />
                              </TableCell>
                              <TableCell>
                                <Skeleton variant="text" width={80} />
                              </TableCell>
                              <TableCell>
                                <Skeleton variant="text" width={60} />
                              </TableCell>
                              <TableCell>
                                <Skeleton variant="text" width={200} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Mobile Card Skeleton */}
                  <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <Grid container spacing={2}>
                      {[...Array(3)].map((_, index) => (
                        <Grid item xs={12} key={index}>
                          <Card
                            sx={{
                              bgcolor: mode === "dark" ? "#1e1e1e" : "#fff",
                              border: `1px solid ${
                                mode === "dark" ? "#333" : "#e0e0e0"
                              }`,
                            }}
                          >
                            <CardContent>
                              <Stack spacing={2}>
                                <Skeleton variant="text" width={200} />
                                <Stack direction="row" spacing={1}>
                                  <Skeleton variant="text" width={80} />
                                </Stack>
                                <Skeleton variant="text" width="100%" />
                                <Skeleton variant="text" width="100%" />
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                >
                                  <Skeleton variant="text" width={60} />
                                  <Skeleton variant="text" width={80} />
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <ToolsTable
                      sortedTools={filteredAndSortedTools}
                      mode={mode}
                      expandedDescriptions={expandedDescriptions}
                      toggleDescription={toggleDescription}
                      getCategoryColor={getCategoryColor}
                      getPricingTierColor={getPricingTierColor}
                      handleSort={handleSort}
                    />
                  </Box>

                  {/* Mobile Card View */}
                  <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <Grid container spacing={2}>
                      {filteredAndSortedTools.map((tool, index) => (
                        <Grid item xs={12} key={index}>
                          <Card
                            sx={{
                              bgcolor: mode === "dark" ? "#1e1e1e" : "#fff",
                              border: `1px solid ${
                                mode === "dark" ? "#333" : "#e0e0e0"
                              }`,
                              boxShadow:
                                mode === "dark"
                                  ? "0 2px 8px rgba(0,0,0,0.2)"
                                  : "0 2px 8px rgba(0,0,0,0.05)",
                              "&:hover": {
                                boxShadow:
                                  mode === "dark"
                                    ? "0 8px 24px rgba(0,0,0,0.3)"
                                    : "0 8px 24px rgba(0,0,0,0.1)",
                              },
                            }}
                          >
                            <CardContent>
                              <Stack spacing={2}>
                                {/* Tool Name and Link */}
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: { xs: "1.25rem", sm: "1.1rem" },
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    {tool.name}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    href={tool.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      color: "text.secondary",
                                      "&:hover": {
                                        color: "primary.main",
                                      },
                                    }}
                                  >
                                    <ExternalLink size={18} />
                                  </IconButton>
                                </Stack>

                                {/* Categories */}
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  flexWrap="wrap"
                                  sx={{ gap: 0.5 }}
                                >
                                  {tool.category.slice(0, 2).map((cat, idx) => {
                                    const colors = getCategoryColor(cat);
                                    return (
                                      <Chip
                                        key={idx}
                                        label={cat}
                                        size="medium"
                                        sx={{
                                          bgcolor: colors.bg,
                                          color: colors.color,
                                          fontWeight: 500,
                                          height: { xs: "28px", sm: "24px" },
                                          "& .MuiChip-label": {
                                            fontSize: {
                                              xs: "0.9rem",
                                              sm: "0.75rem",
                                            },
                                            px: { xs: 1.5, sm: 1 },
                                          },
                                        }}
                                      />
                                    );
                                  })}
                                  {tool.category.length > 2 && (
                                    <Chip
                                      label={`+${tool.category.length - 2}`}
                                      size="medium"
                                      onClick={(e) =>
                                        handleCategoryClick(e, tool.category)
                                      }
                                      sx={{
                                        bgcolor:
                                          mode === "dark" ? "#333" : "#f0f0f0",
                                        color: "text.secondary",
                                        fontWeight: 500,
                                        height: { xs: "28px", sm: "24px" },
                                        "& .MuiChip-label": {
                                          fontSize: {
                                            xs: "0.9rem",
                                            sm: "0.75rem",
                                          },
                                          px: { xs: 1.5, sm: 1 },
                                        },
                                        "&:hover": {
                                          bgcolor:
                                            mode === "dark"
                                              ? "#444"
                                              : "#e0e0e0",
                                        },
                                      }}
                                    />
                                  )}
                                </Stack>

                                {/* Description */}
                                <Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: expandedDescriptions[
                                        index
                                      ]
                                        ? "none"
                                        : 2,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                      lineHeight: 1.6,
                                      fontSize: {
                                        xs: "1rem",
                                        sm: "1rem",
                                        md: "0.875rem",
                                      },
                                    }}
                                  >
                                    {tool.description}
                                  </Typography>
                                  <Button
                                    size="small"
                                    onClick={() => toggleDescription(index)}
                                    sx={{
                                      textTransform: "none",
                                      p: 0,
                                      minWidth: "auto",
                                      fontSize: {
                                        xs: "1rem",
                                        sm: "1rem",
                                        md: "0.875rem",
                                      },
                                      "&:hover": {
                                        backgroundColor: "transparent",
                                        color: "primary.main",
                                      },
                                    }}
                                  >
                                    {expandedDescriptions[index]
                                      ? "Show Less"
                                      : "Read More"}
                                  </Button>
                                </Box>

                                {/* Rating and Pricing */}
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Rating
                                      value={tool.rating}
                                      precision={0.1}
                                      readOnly
                                      size="small"
                                      sx={{
                                        "& .MuiRating-icon": {
                                          fontSize: {
                                            xs: "1.5rem",
                                            sm: "1.25rem",
                                          },
                                        },
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{ ml: 1, color: "text.secondary" }}
                                    >
                                      {tool.rating}
                                    </Typography>
                                  </Box>
                                  <Stack
                                    direction="column"
                                    alignItems="flex-end"
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {tool.price}
                                    </Typography>
                                    {tool.hasPaidPlan && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        Up to {tool.paidPlanPrice}
                                      </Typography>
                                    )}
                                  </Stack>
                                </Stack>

                                {/* Pricing Tier */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Chip
                                    label={tool.pricingTier}
                                    size="small"
                                    sx={{
                                      bgcolor: getPricingTierColor(
                                        tool.pricingTier
                                      ).bg,
                                      color: getPricingTierColor(
                                        tool.pricingTier
                                      ).color,
                                      fontWeight: 500,
                                    }}
                                  />
                                </Box>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        All Categories
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        sx={{ gap: 0.5 }}
                      >
                        {selectedCategories?.map((category, index) => {
                          const colors = getCategoryColor(category);
                          return (
                            <Chip
                              key={index}
                              label={category}
                              size="small"
                              sx={{
                                bgcolor: colors.bg,
                                color: colors.color,
                                fontWeight: 500,
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </Box>
                  </Popover>
                </>
              )}
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
