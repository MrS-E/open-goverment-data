import age from '@/datasets/sk-stat-57.json'

export default function handler(req, res) {
    res.status(200).json(age);
}