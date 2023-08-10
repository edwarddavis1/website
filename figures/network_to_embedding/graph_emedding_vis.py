# %%
import plotly.express as px
import pandas as pd
import networkx as nx
import plotly.graph_objs as go
import plotly.offline as pyo
from embedding_functions import *
from experiment_setup import *
from plotly.subplots import make_subplots

# %%

n = 20
T = 1
# As, tau, _ = make_temporal_simple(n=n, T=T)


def make_A(n, T):
    K = 2
    tau = np.repeat(np.arange(0, K), int(n / K))
    np.random.shuffle(tau)
    B = np.array([[0.2, 0.2], [0.2, 0.4]])
    P_t = np.zeros((n, n))
    for i in range(n):
        P_t[:, i] = B[tau, tau[i]]

    A = np.random.uniform(0, 1, n**2).reshape((n, n)) < P_t

    return np.array([A.astype(float)]), tau


As, tau = make_A(n, T)

# As, tau, _ = make_temporal_simple(n, T)

colours = ["#41b6c4", "#CA054D", "#3B1C32", "#B96D40", "#F9C846", "#6153CC"]
tau_colours = [colours[int(t)] for t in tau]

G = nx.from_numpy_array(As[0])

# Create the scatter plot data
pos = nx.spring_layout(G)
x, y = zip(*pos.values())
node_trace = go.Scatter(
    x=x,
    y=y,
    mode="markers",
    marker=dict(color=tau_colours, size=10, line=dict(width=2)),
    text=list(pos.keys()),
    hoverinfo="text",
)

# Create the edge trace for the network plot
edge_trace = go.Scatter(
    x=[], y=[], line=dict(width=1, color="gray"), hoverinfo="none", mode="lines"
)

# Add the edges to the edge trace
for edge in G.edges():
    x0, y0 = pos[edge[0]]
    x1, y1 = pos[edge[1]]
    edge_trace["x"] += (x0, x1, None)
    edge_trace["y"] += (y0, y1, None)

# Make subplots and add the traces to the left plot
fig = make_subplots(rows=1, cols=2)
fig.add_trace(edge_trace, row=1, col=1)
fig.add_trace(node_trace, row=1, col=1)


# add a scatter subplot to the right side of this network plot
ya = embed(As, 2, "UASE")

fig.add_trace(
    go.Scatter(
        x=ya[:, 0],
        y=ya[:, 1],
        mode="markers",
        marker=dict(color=tau_colours, size=10, line=dict(width=2)),
        text=list(pos.keys()),
        hoverinfo="text",
    ),
    row=1,
    col=2,
)


# remove legend
fig.update_layout(showlegend=False)

# # white background
# fig.update_layout(plot_bgcolor="white")

# # no grid
# fig.update_xaxes(showgrid=False)

# # no ticks or labels
# fig.update_yaxes(showticklabels=False, ticks="", showgrid=False)
# fig.update_xaxes(showticklabels=False, ticks="", showgrid=False)

fig.show()
# %%
# For lots of n

n = [10, 20, 50, 100, 200, 500]


T = 1
colours = ["#41b6c4", "#CA054D", "#3B1C32", "#B96D40", "#F9C846", "#6153CC"]

G_list = []
x_embs = []
y_embs = []
n_list = []
tau_list = []
tau_colours_list = []
tau_for_graphs = []
for nn in n:
    As, tau, _ = make_temporal_simple(n=nn, T=T, K=2)
    # As, tau = make_A(nn, T)
    tau_list.extend(tau)
    tau_for_graphs.append(tau)
    tau_colours = [colours[int(t)] for t in tau]
    tau_colours_list.extend(tau_colours)

    G = nx.from_numpy_array(As[0])
    G_list.append(G)

    # embed
    UA, SA, _ = sparse.linalg.svds(As[0], 2)
    idx = SA.argsort()[::-1]
    UA = UA[:, idx]
    SA = SA[idx]

    # Make sure the eigenvector orientation choice is consistent
    sum_of_ev = np.sum(UA, axis=0)
    for i in range(sum_of_ev.shape[0]):
        if sum_of_ev[i] < 0:
            UA[:, i] = -1 * UA[:, i]

    ya = UA @ np.diag(np.sqrt(SA))

    # ya = embed(As, 2, "UASE")
    x_emb, y_emb = ya[:, 0], ya[:, 1]
    x_embs.extend(x_emb)
    y_embs.extend(y_emb)

    n_list.extend([nn] * nn)

plot_df = pd.DataFrame(
    {
        "x_emb": x_embs,
        "y_emb": y_embs,
        "n": n_list,
        "tau": np.array(tau_list).astype(str),
        "tau_colours": tau_colours_list,
    }
)

id_list = []
for nn in n:
    id_list.extend(np.arange(0, nn))

plot_df["id"] = id_list
# %%
# # Save as csv
plot_df.to_csv("data/plot_df.csv")
#
from networkx.readwrite import json_graph
import json


# json_graph.node_link_data(G_list[0])

# # Save json graph
# for i, G in enumerate(G_list):
#     with open(f"graph_n={n[i]}.json", "w") as f:
#         json.dump(json_graph.node_link_data(G), f)


# Save json graph
for i, G in enumerate(G_list):
    # Convert tau_for_graphs to a list of ints
    tau_list = tau_for_graphs[i].astype(int).tolist()
    # Set tau as a node attribute
    nx.set_node_attributes(G, dict(zip(G.nodes(), tau_list)), "tau")
    # Save graph as a JSON file
    with open(f"data/graph_n={n[i]}.json", "w") as f:
        json.dump(json_graph.node_link_data(G), f)

# %%
