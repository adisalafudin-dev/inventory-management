interface Tag {
  id: number;
  namaTag: string;
}

interface TagPickerProps {
  tags: Tag[]; // semua tag dari useTags()
  value: number[]; // tag terpilih (field.value)
  onChange: (value: number[]) => void;
}

export function TagPicker({ tags, value, onChange }: TagPickerProps) {
  const available = tags.filter((tag) => !value.includes(tag.id));

  const add = (tag: Tag) => onChange([...value, tag.id]);

  const remove = (id: number) => onChange(value.filter((v) => v !== id));

  const chip =
    "rounded-full border border-border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Tag terpilih</p>
        <div className="flex min-h-7 flex-wrap gap-1.5">
          {value.length === 0 && (
            <span className="text-xs text-muted-foreground">
              Belum ada tag dipilih
            </span>
          )}
          {value.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId);
            return (
              <button
                key={tagId}
                type="button"
                onClick={() => remove(tagId)}
                aria-label={`Hapus tag ${tag?.namaTag}`}
                className={`${chip} bg-primary text-primary-foreground hover:opacity-80`}
              >
                #{tag?.namaTag || tagId} ×
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-border" />

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Tag tersedia</p>
        <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
          {available.length === 0 && (
            <span className="text-xs text-muted-foreground">
              Tidak ada tag lain
            </span>
          )}
          {available.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => add(tag)}
              aria-label={`Tambah tag ${tag.namaTag}`}
              className={`${chip} bg-background hover:bg-muted`}
            >
              #{tag.namaTag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
