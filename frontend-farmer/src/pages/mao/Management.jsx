import { useState, useEffect } from "react";
import { Plus, Eye, Pencil, Archive } from "lucide-react";
import {
  PageHead,
  Panel,
  Records,
  SearchBox,
  Select,
  Field,
  Badge,
  Modal,
} from "../../components/common/UI";
import { QueryState, Pagination } from "../../components/common/Async";
import { useApp } from "../../hooks/useApp";
import { useQuery } from "../../hooks/useQuery";
import { cropService } from "../../services/cropService";
import { marketService } from "../../services/marketService";
import { priceService } from "../../services/priceService";
import { errorMessage } from "../../services/api";
import { money } from "../../utils/format";
export default function Management({ kind }) {
  const { data, reload, notify } = useApp();
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [category, setCategory] = useState(""),
    [market, setMarket] = useState(""),
    [crop, setCrop] = useState(""),
    [dateFrom, setFrom] = useState(""),
    [dateTo, setTo] = useState(""),
    [page, setPage] = useState(1),
    [edit, setEdit] = useState(null),
    [view, setView] = useState(null),
    [archive, setArchive] = useState(null),
    [photo, setPhoto] = useState(null),
    [preview, setPreview] = useState(""),
    [busy, setBusy] = useState(false);
  const historical = kind === "history",
    catalog = ["crops", "markets"].includes(kind),
    service =
      kind === "crops"
        ? cropService
        : kind === "markets"
          ? marketService
          : priceService;
  const query = useQuery(
    () =>
      historical
        ? priceService.history({
            page,
            search,
            marketId: market || undefined,
            cropId: crop || undefined,
            dateFrom: dateFrom || undefined,
            dateTo: dateTo || undefined,
          })
        : service.list({
            page,
            search,
            status: status || undefined,
            ...(kind === "crops" ? { category: category || undefined } : {}),
            ...(kind === "prices" ? { marketId: market || undefined } : {}),
          }),
    [kind, page, search, status, category, market, crop, dateFrom, dateTo],
  );
  useEffect(
    () => setPage(1),
    [search, status, category, market, crop, dateFrom, dateTo],
  );
  useEffect(() => {
    if (!photo) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  const rows = query.data?.items || [];
  const named = (r) =>
    r.name || r.crop?.name || data.crops.find((c) => c.id === r.cropId)?.name;
  const columns = catalog
    ? [
        {
          key: "name",
          label: kind === "crops" ? "Crop" : "Market",
          render: (r) => (
            <span className="crop-identity">
              {kind === "crops" && (
                <img src={r.imageUrl} alt={`${r.name} crop`} />
              )}
              <strong>{r.name}</strong>
            </span>
          ),
        },
        ...(kind === "crops"
          ? [
              { key: "category", label: "Category" },
              { key: "unit", label: "Unit" },
            ]
          : [
              { key: "location", label: "Location" },
              {
                key: "transportBaseCost",
                label: "Transport / 100 kg",
                render: (r) => money(r.transportBaseCost),
              },
            ]),
        {
          key: "status",
          label: "Status",
          render: (r) => <Badge>{r.status}</Badge>,
        },
      ]
    : [
        { key: "cropId", label: "Crop", render: named },
        { key: "marketId", label: "Market", render: (r) => r.market?.name },
        { key: "price", label: "Price / kg", render: (r) => money(r.price) },
        { key: "date", label: "Date", render: (r) => r.date.slice(0, 10) },
        {
          key: "status",
          label: "Status",
          render: (r) => <Badge>{r.status}</Badge>,
        },
      ];
  function open(r) {
    setPhoto(null);
    setEdit(
      r ||
        (kind === "crops"
          ? { name: "", category: "Vegetable", unit: "kg", status: "ACTIVE" }
          : kind === "markets"
            ? {
                name: "",
                location: "",
                transportBaseCost: 0,
                distanceKm: null,
                status: "ACTIVE",
              }
            : {
                cropId: data.crops[0]?.id || "",
                marketId: data.markets[0]?.id || "",
                price: "",
                date: new Date().toISOString().slice(0, 10),
                source: "",
              }),
    );
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      let fields;
      if (kind === "crops") {
        fields = {
          name: edit.name,
          category: edit.category,
          unit: edit.unit,
          status: edit.status,
        };
        if (!edit.id && !photo) throw new Error("Choose a crop photo.");
        await cropService.save(edit.id, fields, photo);
      } else if (kind === "markets") {
        fields = {
          name: edit.name,
          location: edit.location,
          transportBaseCost: Number(edit.transportBaseCost),
          distanceKm:
            edit.distanceKm == null || edit.distanceKm === ""
              ? null
              : Number(edit.distanceKm),
          status: edit.status,
        };
        await marketService.save(edit.id, fields);
      } else {
        fields = {
          cropId: edit.cropId,
          marketId: edit.marketId,
          price: Number(edit.price),
          date: edit.date.slice(0, 10),
          source: edit.source,
        };
        await priceService.save(edit.id, fields);
      }
      setEdit(null);
      query.reload();
      await reload();
      notify(
        kind === "prices"
          ? "Price submitted for validation."
          : "Changes saved successfully.",
      );
    } catch (e) {
      notify(e.response ? errorMessage(e) : e.message);
    } finally {
      setBusy(false);
    }
  }
  const set = (key, value) => setEdit({ ...edit, [key]: value });
  return (
    <>
      <PageHead
        title={
          {
            crops: "Crop Management",
            markets: "Market Management",
            prices: "Crop Price Management",
            history: "Historical Records",
          }[kind]
        }
        description={
          kind === "prices"
            ? "New and edited prices enter validation before publication."
            : undefined
        }
        action={
          !historical && (
            <button className="button" onClick={() => open()}>
              <Plus size={18} />
              Add{" "}
              {kind === "crops"
                ? "Crop"
                : kind === "markets"
                  ? "Market"
                  : "Price"}
            </button>
          )
        }
      />
      <div className="filter-bar">
        <SearchBox value={search} onChange={setSearch} />
        {!historical && (
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { id: "", name: "All statuses" },
              ...(catalog
                ? ["ACTIVE", "ARCHIVED"]
                : ["PENDING", "VERIFIED", "REJECTED"]
              ).map((id) => ({ id, name: id })),
            ]}
          />
        )}{" "}
        {kind === "crops" && (
          <Select
            label="Category"
            value={category}
            onChange={setCategory}
            options={[
              { id: "", name: "All categories" },
              ...["Grain", "Vegetable", "Fruit"].map((id) => ({
                id,
                name: id,
              })),
            ]}
          />
        )}{" "}
        {!catalog && (
          <Select
            label="Market"
            value={market}
            onChange={setMarket}
            options={[{ id: "", name: "All markets" }, ...data.markets]}
          />
        )}{" "}
        {historical && (
          <>
            <Select
              label="Crop"
              value={crop}
              onChange={setCrop}
              options={[{ id: "", name: "All crops" }, ...data.crops]}
            />
            <Field label="From">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setFrom(e.target.value)}
              />
            </Field>
            <Field label="To">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setTo(e.target.value)}
              />
            </Field>
          </>
        )}
      </div>
      <QueryState query={query}>
        <Panel>
          <Records
            rows={rows}
            columns={columns}
            actions={(r) => (
              <>
                <button
                  className="button secondary small"
                  onClick={() => setView(r)}
                >
                  <Eye size={15} />
                  View
                </button>
                {!historical && (
                  <button
                    className="button secondary small"
                    onClick={() => open({ ...r, date: r.date?.slice(0, 10) })}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                )}
                {catalog && r.status === "ACTIVE" && (
                  <button
                    className="icon-button"
                    aria-label={`Archive ${named(r)}`}
                    onClick={() => setArchive(r)}
                  >
                    <Archive size={18} />
                  </button>
                )}
              </>
            )}
          />
        </Panel>
        <Pagination data={query.data} onPage={setPage} />
      </QueryState>
      {edit && (
        <Modal
          title={`${edit.id ? "Edit" : "Add"} ${kind === "crops" ? "Crop" : kind === "markets" ? "Market" : "Price"}`}
          onClose={() => setEdit(null)}
        >
          <form className="form-stack" onSubmit={save}>
            {catalog ? (
              <>
                <Field label={kind === "crops" ? "Crop Name" : "Market Name"}>
                  <input
                    required
                    maxLength={100}
                    value={edit.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </Field>
                {kind === "crops" ? (
                  <>
                    <Select
                      label="Category"
                      value={edit.category}
                      onChange={(v) => set("category", v)}
                      options={["Grain", "Vegetable", "Fruit"].map((id) => ({
                        id,
                        name: id,
                      }))}
                    />
                    <Field label="Unit">
                      <input readOnly value="kg" />
                    </Field>
                    <Field
                      label="Crop Photo"
                      hint="JPEG, PNG or WebP. Maximum 5 MB. Required for new crops."
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        required={!edit.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (
                            file &&
                            (![
                              "image/jpeg",
                              "image/png",
                              "image/webp",
                            ].includes(file.type) ||
                              file.size > 5 * 1024 * 1024)
                          ) {
                            e.target.value = "";
                            setPhoto(null);
                            notify(
                              "Choose a JPEG, PNG or WebP photo up to 5 MB.",
                            );
                            return;
                          }
                          setPhoto(file);
                        }}
                      />
                    </Field>
                    {(preview || edit.imageUrl) && (
                      <img
                        className="crop-photo-preview"
                        src={preview || edit.imageUrl}
                        alt={`${edit.name || "Selected"} crop photo preview`}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Field label="Location">
                      <input
                        required
                        value={edit.location}
                        onChange={(e) => set("location", e.target.value)}
                      />
                    </Field>
                    <Field label="Transport Cost / 100 kg (₱)">
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={edit.transportBaseCost}
                        onChange={(e) =>
                          set("transportBaseCost", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Distance (km, optional)">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={edit.distanceKm ?? ""}
                        onChange={(e) => set("distanceKm", e.target.value)}
                      />
                    </Field>
                  </>
                )}
                <Select
                  label="Status"
                  value={edit.status}
                  onChange={(v) => set("status", v)}
                  options={["ACTIVE", "ARCHIVED"].map((id) => ({
                    id,
                    name: id,
                  }))}
                />
              </>
            ) : (
              <>
                <Select
                  label="Crop"
                  disabled={edit.status === "VERIFIED"}
                  value={edit.cropId}
                  onChange={(v) => set("cropId", v)}
                  options={data.crops}
                />
                <Select
                  label="Market"
                  disabled={edit.status === "VERIFIED"}
                  value={edit.marketId}
                  onChange={(v) => set("marketId", v)}
                  options={data.markets}
                />
                <Field label="Price / kg">
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={edit.price}
                    onChange={(e) => set("price", e.target.value)}
                  />
                </Field>
                <Field label="Record Date">
                  <input
                    type="date"
                    readOnly={edit.status === "VERIFIED"}
                    max={new Date().toISOString().slice(0, 10)}
                    required
                    value={edit.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                </Field>
                <Field label="Source">
                  <input
                    required
                    maxLength={200}
                    value={edit.source}
                    onChange={(e) => set("source", e.target.value)}
                  />
                </Field>
                <p className="muted">
                  Changes remain pending until approved. The verified quotation
                  stays available in the meantime.
                </p>
              </>
            )}
            <button disabled={busy} className="button">
              {busy
                ? "Saving…"
                : kind === "prices"
                  ? "Submit Price"
                  : edit.id
                    ? "Save Changes"
                    : kind === "crops"
                      ? "Add Crop"
                      : "Add Market"}
            </button>
          </form>
        </Modal>
      )}
      {view && (
        <Modal title={named(view)} onClose={() => setView(null)}>
          <dl className="result-lines">
            {columns.map((c) => (
              <div key={c.key}>
                <dt>{c.label}</dt>
                <dd>{c.render ? c.render(view) : view[c.key]}</dd>
              </div>
            ))}
          </dl>
          {view.reviewNote && <p>{view.reviewNote}</p>}
        </Modal>
      )}
      {archive && (
        <Modal
          title={`Archive ${named(archive)}?`}
          onClose={() => setArchive(null)}
        >
          <p>
            This removes the record from active comparisons. Historical records
            remain available.
          </p>
          <button
            className="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await service.status(archive.id, "ARCHIVED");
                setArchive(null);
                query.reload();
                await reload();
                notify("Record archived.");
              } catch (e) {
                notify(errorMessage(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            Archive {kind === "crops" ? "Crop" : "Market"}
          </button>
        </Modal>
      )}
    </>
  );
}
