'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface FileItem {
  name: string;
  size: number;
  lastModified: string;
  url: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼️';
  if (['pdf'].includes(ext)) return '📄';
  if (['doc', 'docx'].includes(ext)) return '📝';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '🗜️';
  if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return '🎬';
  if (['mp3', 'wav', 'flac'].includes(ext)) return '🎵';
  return '📁';
}

function getOriginalName(objectName: string): string {
  // Strip timestamp prefix: "1234567890-filename.ext" -> "filename.ext"
  return objectName.replace(/^\d+-/, '').replace(/_/g, ' ');
}

export default function ERPStoragePage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/files/list');
      const data = await res.json();
      if (data.success) {
        setFiles(data.data);
      } else {
        setError(data.error || 'Gagal mengambil daftar file');
      }
    } catch {
      setError('MinIO tidak terhubung. Pastikan Docker sedang berjalan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError(null);

    const results = await Promise.allSettled(
      Array.from(fileList).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/files/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        return data;
      })
    );

    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      setError(`${failed.length} file gagal diupload.`);
    } else {
      showSuccess(`${fileList.length} file berhasil diupload!`);
    }

    setUploading(false);
    await fetchFiles();
  };

  const handleDelete = async (objectName: string) => {
    setDeletingFile(objectName);
    try {
      const res = await fetch(`/api/files/${encodeURIComponent(objectName)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showSuccess('File berhasil dihapus');
        setFiles((prev) => prev.filter((f) => f.name !== objectName));
      } else {
        setError(data.error || 'Gagal menghapus file');
      }
    } catch {
      setError('Gagal menghapus file');
    } finally {
      setDeletingFile(null);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <a href="/" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '0.9rem' }}>← Kembali</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
              📦 ERP Storage
            </h1>
            <p style={{ margin: '0.25rem 0 0', color: '#a78bfa', fontSize: '0.95rem' }}>
              Manajemen berkas terpusat via MinIO — bucket: <code style={{ background: '#ffffff15', padding: '2px 6px', borderRadius: '4px' }}>erp-storage</code>
            </p>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[
              { label: 'Total File', value: files.length },
              { label: 'Total Ukuran', value: formatBytes(totalSize) },
            ].map((stat) => (
              <div key={stat.label} style={{ background: '#ffffff0f', border: '1px solid #ffffff15', borderRadius: '12px', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#c4b5fd' }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div style={{ background: '#064e3b', border: '1px solid #10b981', borderRadius: '10px', padding: '0.75rem 1rem', color: '#6ee7b7', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✅ {successMsg}
          </div>
        )}
        {error && (
          <div style={{ background: '#450a0a', border: '1px solid #ef4444', borderRadius: '10px', padding: '0.75rem 1rem', color: '#fca5a5', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
          </div>
        )}

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#a78bfa' : '#4c1d95'}`,
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: dragOver ? '#a78bfa18' : '#ffffff08',
            transition: 'all 0.2s ease',
            marginBottom: '1.5rem',
          }}
        >
          <input ref={fileInputRef} type="file" multiple hidden onChange={(e) => handleUpload(e.target.files)} disabled={uploading} />
          {uploading ? (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }}>⏳</div>
              <p style={{ color: '#a78bfa', margin: 0, fontWeight: 600 }}>Mengupload file...</p>
            </>
          ) : (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>☁️</div>
              <p style={{ color: '#e2e8f0', margin: '0 0 0.25rem', fontWeight: 600, fontSize: '1.05rem' }}>
                Drag & drop file ke sini, atau klik untuk memilih
              </p>
              <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>Mendukung semua jenis file — maks 50MB per file</p>
            </>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>🔍</span>
          <input
            type="text"
            placeholder="Cari file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
              background: '#ffffff0d', border: '1px solid #ffffff18',
              borderRadius: '10px', color: '#e2e8f0', fontSize: '0.95rem',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* File List */}
        <div style={{ background: '#ffffff08', border: '1px solid #ffffff12', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid #ffffff10', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>Nama File</span>
            <span>Ukuran</span>
            <span>Tanggal Upload</span>
            <span>Aksi</span>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
              <p style={{ margin: 0 }}>Memuat file...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📭</div>
              <p style={{ margin: 0 }}>{searchQuery ? 'Tidak ada file yang cocok' : 'Belum ada file. Upload sekarang!'}</p>
            </div>
          ) : (
            filteredFiles.map((file, idx) => (
              <div
                key={file.name}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto',
                  gap: '1rem', padding: '0.875rem 1.25rem', alignItems: 'center',
                  borderBottom: idx < filteredFiles.length - 1 ? '1px solid #ffffff08' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ffffff08')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{getFileIcon(file.name)}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {getOriginalName(file.name)}
                    </p>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </p>
                  </div>
                </div>

                {/* Size */}
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{formatBytes(file.size)}</span>

                {/* Date */}
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {new Date(file.lastModified).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download"
                    style={{
                      background: '#1e3a5f', border: '1px solid #2563eb33',
                      borderRadius: '8px', padding: '0.4rem 0.7rem',
                      color: '#60a5fa', textDecoration: 'none', fontSize: '0.85rem',
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    }}
                  >
                    ⬇️
                  </a>
                  <button
                    onClick={() => handleDelete(file.name)}
                    disabled={deletingFile === file.name}
                    title="Hapus"
                    style={{
                      background: '#450a0a', border: '1px solid #ef444433',
                      borderRadius: '8px', padding: '0.4rem 0.7rem',
                      color: '#f87171', cursor: 'pointer', fontSize: '0.85rem',
                      opacity: deletingFile === file.name ? 0.5 : 1,
                    }}
                  >
                    {deletingFile === file.name ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#334155', fontSize: '0.8rem' }}>
          Powered by MinIO Object Storage • ERP SuzukiRide
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: #475569; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
