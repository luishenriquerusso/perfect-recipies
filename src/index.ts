import express, { Request, Response, NextFunction } from 'express';
import mongoose, { Schema, Document, Model } from 'mongoose';

const app = express();
app.use(express.json());
import dotenv from 'dotenv';
dotenv.config();


mongoose.connect(process.env.MONGO_URI as string)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


// Definição dos Tipos
interface IUser extends Document {
    name: string;
    nickname: string;
    email: string;
    password: string;
    requiresPassChange: boolean;
    suspended: boolean;
    image: string;
}

interface IBusiness extends Document {
    name: string;
    description: string;
    nicheId: number;
    image: string;
    favoriteRecipes: string[];
    main: boolean;
}

interface IRecipe extends Document {
    name: string;
    image: string;
    owner: mongoose.Types.ObjectId;
    portionWeights: object;
    recipeOwnedByUser: boolean;
    addedAt: Date;
}

interface IIngredient extends Document {
    name: string;
    measureUnit: string;
    density: number;
}

// Definição dos Schemas
const UserSchema = new Schema<IUser>({
    name: String,
    nickname: String,
    email: String,
    password: String,
    requiresPassChange: Boolean,
    suspended: Boolean,
    image: String,
});

const BusinessSchema = new Schema<IBusiness>({
    name: String,
    description: String,
    nicheId: Number,
    image: String,
    favoriteRecipes: [String],
    main: Boolean,
});

const RecipeSchema = new Schema<IRecipe>({
    name: String,
    image: String,
    owner: { type: Schema.Types.ObjectId, ref: 'Business' },
    portionWeights: Object,
    recipeOwnedByUser: Boolean,
    addedAt: Date,
});

const IngredientSchema = new Schema<IIngredient>({
    name: String,
    measureUnit: String,
    density: Number,
});

// Modelos
const User = mongoose.model<IUser>('User', UserSchema);
const Business = mongoose.model<IBusiness>('Business', BusinessSchema);
const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema);
const Ingredient = mongoose.model<IIngredient>('Ingredient', IngredientSchema);

app.get('/', (req: Request, res: Response) => {
    res.send('Rota padrão');
});


app.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/users/:id', async (req: Request, res: any, next: any) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/users/:id', async (req: Request, res: any, next: any) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
