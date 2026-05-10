<?php
/**
 * CacheManager.php - Professional Caching Layer
 * Supports APCu, Redis, and File-based caching
 */

class CacheManager {
    private $db;
    private $cacheType = 'file'; // 'apcu', 'redis', or 'file'
    private $cachePath = __DIR__ . '/../cache/';
    private $redisClient;
    private $ttl = 3600; // 1 hour default

    public function __construct($db, $cacheType = 'file') {
        $this->db = $db;
        $this->cacheType = $cacheType;

        if (!file_exists($this->cachePath)) {
            mkdir($this->cachePath, 0755, true);
        }

        if ($cacheType === 'redis') {
            $this->redisClient = new Redis();
            $this->redisClient->connect('127.0.0.1', 6379);
        }
    }

    /**
     * Get cache
     */
    public function get($key) {
        switch ($this->cacheType) {
            case 'apcu':
                return apcu_fetch($key);
            case 'redis':
                return $this->redisClient->get($key);
            case 'file':
                return $this->getFileCache($key);
            default:
                return null;
        }
    }

    /**
     * Set cache
     */
    public function set($key, $value, $ttl = null) {
        $ttl = $ttl ?? $this->ttl;

        switch ($this->cacheType) {
            case 'apcu':
                apcu_store($key, $value, $ttl);
                break;
            case 'redis':
                $this->redisClient->setex($key, $ttl, json_encode($value));
                break;
            case 'file':
                $this->setFileCache($key, $value, $ttl);
                break;
        }
    }

    /**
     * Delete cache
     */
    public function delete($key) {
        switch ($this->cacheType) {
            case 'apcu':
                apcu_delete($key);
                break;
            case 'redis':
                $this->redisClient->del($key);
                break;
            case 'file':
                $this->deleteFileCache($key);
                break;
        }
    }

    /**
     * Clear all cache
     */
    public function flush() {
        switch ($this->cacheType) {
            case 'apcu':
                apcu_clear_cache();
                break;
            case 'redis':
                $this->redisClient->flushDB();
                break;
            case 'file':
                array_map('unlink', glob($this->cachePath . '*'));
                break;
        }
    }

    /**
     * File-based cache - Get
     */
    private function getFileCache($key) {
        $file = $this->cachePath . md5($key) . '.cache';
        if (!file_exists($file)) {
            return null;
        }

        $data = unserialize(file_get_contents($file));
        if ($data['expires'] < time()) {
            unlink($file);
            return null;
        }

        return $data['value'];
    }

    /**
     * File-based cache - Set
     */
    private function setFileCache($key, $value, $ttl) {
        $file = $this->cachePath . md5($key) . '.cache';
        $data = [
            'value' => $value,
            'expires' => time() + $ttl
        ];
        file_put_contents($file, serialize($data));
    }

    /**
     * File-based cache - Delete
     */
    private function deleteFileCache($key) {
        $file = $this->cachePath . md5($key) . '.cache';
        if (file_exists($file)) {
            unlink($file);
        }
    }

    /**
     * Cache products
     */
    public function cacheProducts($category = null, $ttl = 3600) {
        $cacheKey = 'products_' . ($category ?? 'all');
        $cached = $this->get($cacheKey);

        if ($cached !== null) {
            return $cached;
        }

        $query = "SELECT * FROM products WHERE stock_quantity > 0 ORDER BY rating DESC LIMIT 100";
        if ($category) {
            $query = "SELECT * FROM products WHERE category_id = ? AND stock_quantity > 0 ORDER BY rating DESC LIMIT 100";
        }

        $stmt = $this->db->prepare($query);
        if ($category) {
            $stmt->bind_param('i', $category);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $products = $result->fetch_all(MYSQLI_ASSOC);

        $this->set($cacheKey, $products, $ttl);
        return $products;
    }

    /**
     * Invalidate cache
     */
    public function invalidatePattern($pattern) {
        if ($this->cacheType === 'redis') {
            $keys = $this->redisClient->keys($pattern);
            foreach ($keys as $key) {
                $this->redisClient->del($key);
            }
        }
    }
}
?>
